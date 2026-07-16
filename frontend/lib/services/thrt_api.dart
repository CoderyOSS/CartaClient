import 'dart:convert';
import 'package:http/http.dart' as http;

class ThrtApiException implements Exception {
  final int statusCode;
  final String body;
  ThrtApiException(this.statusCode, this.body);
  @override
  String toString() => 'ThrtApiException($statusCode): $body';
}

class FlowStatus {
  final bool deployed;
  final Map<String, ({int msgsIn, int msgsOut})> nodes;

  const FlowStatus({required this.deployed, this.nodes = const {}});

  factory FlowStatus.undeployed() => const FlowStatus(deployed: false);
}

class ThrtApi {
  final String _baseUrl;
  final http.Client _client;

  ThrtApi(this._baseUrl, {http.Client? client})
      : _client = client ?? http.Client();

  /// Deploy an already-saved flow (must exist in THRT.Store).
  Future<void> deploy(String name) async {
    final resp = await _post('/api/v1/workflows/${Uri.encodeComponent(name)}/deploy', {});
    if (resp.statusCode != 200) {
      throw ThrtApiException(resp.statusCode, resp.body);
    }
  }

  Future<void> undeploy(String name) async {
    final resp = await _client.delete(
      _uri('/api/v1/workflows/${Uri.encodeComponent(name)}/deploy'),
    );
    if (resp.statusCode != 200 && resp.statusCode != 404) {
      throw ThrtApiException(resp.statusCode, resp.body);
    }
  }

  /// Get runtime status of a flow. Returns `deployed=false` if not running.
  Future<FlowStatus> status(String name) async {
    final resp = await _get('/api/v1/workflows/${Uri.encodeComponent(name)}/status');
    if (resp.statusCode == 404) return FlowStatus.undeployed();
    if (resp.statusCode != 200) {
      throw ThrtApiException(resp.statusCode, resp.body);
    }
    final body = jsonDecode(resp.body) as Map<String, dynamic>;
    final nodesList = (body['nodes'] as List).cast<Map<String, dynamic>>();
    final nodes = <String, ({int msgsIn, int msgsOut})>{};
    for (final n in nodesList) {
      final id = n['node_id'] as String;
      nodes[id] = (
        msgsIn: (n['msgs_in'] as num).toInt(),
        msgsOut: (n['msgs_out'] as num).toInt(),
      );
    }
    return FlowStatus(deployed: true, nodes: nodes);
  }

  /// Inject a payload into a specific node of a running flow.
  Future<void> trigger(String name, String nodeId, dynamic payload) async {
    final resp = await _post('/api/v1/workflows/${Uri.encodeComponent(name)}/trigger', {
      'node_id': nodeId,
      'payload': payload,
    });
    if (resp.statusCode != 200) {
      throw ThrtApiException(resp.statusCode, resp.body);
    }
  }

  // ---- HTTP plumbing ----

  Uri _uri(String path) {
    final base = _baseUrl.endsWith('/')
        ? _baseUrl.substring(0, _baseUrl.length - 1)
        : _baseUrl;
    return Uri.parse('$base$path');
  }

  Future<http.Response> _get(String path) =>
      _client.get(_uri(path), headers: _headers());

  Future<http.Response> _post(String path, Map<String, dynamic> body) =>
      _client.post(_uri(path), headers: _headers(), body: jsonEncode(body));

  Map<String, String> _headers() => const {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
}
