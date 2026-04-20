import 'dart:typed_data';
import 'package:archive/archive.dart';
import 'package:flutter/material.dart';
import '../../models/project_type.dart';

class ProjectDetector {
  /// يقوم بفحص ملفات الـ ZIP وإعادة هوية المشروع المكتشفة
  static ProjectIdentity detect(Uint8List zipBytes) {
    final archive = ZipDecoder().decodeBytes(zipBytes);
    
    // استخراج قائمة بأسماء الملفات الموجودة في الجذر (Root)
    List<String> fileNames = archive.files.map((file) => file.name).toList();

    if (fileNames.any((name) => name.contains('pubspec.yaml'))) {
      return ProjectIdentity(
        type: ProjectType.flutter,
        displayName: 'Flutter Project',
        description: 'مشروع تطبيقات فلاتر، جاهز لبناء ملفات APK سحابياً.',
        icon: Icons.flutter_dash,
      );
    } 
    
    if (fileNames.any((name) => name.contains('requirements.txt') || name.endsWith('.py'))) {
      return ProjectIdentity(
        type: ProjectType.python,
        displayName: 'Python Script / Tool',
        description: 'سكربت بايثون، جاهز لتهيئة بيئة SEO أو أتمتة.',
        icon: Icons.terminal,
      );
    }

    if (fileNames.any((name) => name.contains('package.json'))) {
      return ProjectIdentity(
        type: ProjectType.nodejs,
        displayName: 'Node.js / React',
        description: 'مشروع ويب حديث، جاهز للبناء والنشر سحابياً.',
        icon: Icons.javascript,
      );
    }

    if (fileNames.any((name) => name.contains('index.html'))) {
      return ProjectIdentity(
        type: ProjectType.staticWeb,
        displayName: 'Static Website',
        description: 'موقع ويب ثابت، جاهز للنشر الفوري على GitHub Pages.',
        icon: Icons.html,
      );
    }

    return ProjectIdentity(
      type: ProjectType.unknown,
      displayName: 'Unknown Project',
      description: 'لم يتم التعرف على نوع المشروع، سيتم الرفع كملفات عادية.',
      icon: Icons.help_outline,
    );
  }
}