import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PickerAnchor {
  final Offset screenPos;
  final String sourceNodeId;

  const PickerAnchor({
    required this.screenPos,
    required this.sourceNodeId,
  });
}

final operatorPickerProvider = StateProvider<PickerAnchor?>((ref) => null);
