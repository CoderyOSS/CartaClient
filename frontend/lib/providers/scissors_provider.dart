import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final scissorsModeProvider = StateProvider<bool>((ref) => false);
final cutPathProvider = StateProvider<List<Offset>>((ref) => const []);
