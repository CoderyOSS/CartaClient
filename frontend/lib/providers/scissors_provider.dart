import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

enum FlashMode { scissors, cursor }

final scissorsModeProvider = StateProvider<bool>((ref) => false);
final cutPathProvider = StateProvider<List<Offset>>((ref) => const []);
final flashOverlayProvider = StateProvider<({FlashMode mode, int id})?>((ref) => null);
