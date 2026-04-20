import '../../models/project_type.dart';
import 'yaml_templates.dart';

class YamlGenerator {
  /// توليد كود YAML بناءً على نوع المشروع والهدف المختار
  static String generate(ProjectType type, String branch, String selectedOption) {
    switch (type) {
      case ProjectType.flutter:
        return YamlTemplates.flutterBuild(branch);
      case ProjectType.python:
        return YamlTemplates.pythonSEO(branch);
      case ProjectType.staticWeb:
        return YamlTemplates.staticWeb(branch);
      default:
        return "";
    }
  }
}