import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/providers/configs_provider.dart';
import 'package:frontend/services/configs_api.dart';
import 'package:frontend/widgets/settings/configs_section.dart';

class _FakeConfigsApi extends ConfigsApi {
  _FakeConfigsApi() : super('/api/v1');
  @override
  Future<List<ConfigDto>> list() async => const [
        ConfigDto(key: 'db', source: '%{host: "h"}', updatedAt: '2026-07-23T00:00:00Z'),
        ConfigDto(key: 'cache', source: '%{ttl: 60}', updatedAt: null),
      ];
}

void main() {
  testWidgets('renders config keys from the provider', (tester) async {
    await tester.pumpWidget(ProviderScope(
      overrides: [configsApiProvider.overrideWithValue(_FakeConfigsApi())],
      child: const MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(child: ConfigsSection()),
        ),
      ),
    ));
    await tester.pumpAndSettle();

    expect(find.text('db'), findsOneWidget);
    expect(find.text('cache'), findsOneWidget);
    expect(find.textContaining('CONFIGS (2)'), findsOneWidget);
  });

  testWidgets('shows empty-state copy when there are no configs', (tester) async {
    final fake = _FakeEmptyApi();
    await tester.pumpWidget(ProviderScope(
      overrides: [configsApiProvider.overrideWithValue(fake)],
      child: const MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(child: ConfigsSection()),
        ),
      ),
    ));
    await tester.pumpAndSettle();

    expect(find.textContaining('No configuration objects yet'), findsOneWidget);
  });
}

class _FakeEmptyApi extends ConfigsApi {
  _FakeEmptyApi() : super('/api/v1');
  @override
  Future<List<ConfigDto>> list() async => const [];
}
