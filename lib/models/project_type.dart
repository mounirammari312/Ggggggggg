import 'package:flutter/material.dart'; // هذا هو السطر الذي ينقصك لتعريف IconData

enum ProjectType {
  flutter,
  python,
  staticWeb,
  nodejs,
  unknown
}

class ProjectIdentity {
  final ProjectType type;
  final String displayName;
  final String description;
  final IconData icon;

  ProjectIdentity({
    required this.type,
    required this.displayName,
    required this.description,
    required this.icon,
  });
}
