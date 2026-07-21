import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/subflows_api.dart';

final subflowsApiProvider = Provider<SubflowsApi>((ref) {
  return SubflowsApi('/api/v1');
});

/// All subflows in the open project (subflows/*.yaml). Refresh by
/// `ref.invalidate()`.
final subflowsProvider = FutureProvider<List<SubflowDto>>((ref) async {
  return ref.read(subflowsApiProvider).list();
});
