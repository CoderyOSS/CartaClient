import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/providers/thrt_provider.dart';
import 'package:frontend/services/thrt_api.dart';
import 'package:frontend/widgets/canvas/operator_picker.dart';

void main() {
  testWidgets(
      'installed modules category renders under ACTORS, above FUNCTIONS',
      (tester) async {
    final container = ProviderContainer(
      overrides: [
        installedNodesProvider.overrideWith(
          (ref) async => const [
            InstalledNode(
              type: 'harness',
              module: 'X.Harness',
              actor: true,
              label: 'harness',
              desc: 'd',
            ),
          ],
        ),
      ],
    );
    addTearDown(container.dispose);

    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: MaterialApp(
          home: Scaffold(
            body: OperatorPicker(
              anchor: Offset.zero,
              onSelect: (_) {},
              onClose: () {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final yActors = tester.getTopLeft(find.text('ACTORS')).dy;
    final yInstalled = tester.getTopLeft(find.text('INSTALLED MODULES')).dy;
    final yFunctions = tester.getTopLeft(find.text('FUNCTIONS')).dy;

    expect(yActors, lessThan(yInstalled));
    expect(yInstalled, lessThan(yFunctions));
  });
}
