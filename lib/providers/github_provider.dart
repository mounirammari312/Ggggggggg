import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:archive/archive.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/factory/yaml_generator.dart';
import '../models/project_type.dart';

class GitHubProvider with ChangeNotifier {
  // المتغيرات الخاصة بالهوية والاتصال
  String _token = '';
  String _repo = '';
  String _branch = 'main';
  bool _isLoading = false;
  String _statusMessage = '';
  List<dynamic> _artifacts = [];

  // --- البداية: الأكواد الجديدة التي سألت عنها ---

  /// فحص حالة الاتصال بناءً على وجود البيانات الأساسية
  bool get isConnected => _token.isNotEmpty && _repo.isNotEmpty;

  /// استخراج اسم المستخدم من اسم المستودع (مثلاً: moussaben/repo_name)
  String get githubUsername {
    if (_repo.contains('/')) {
      return _repo.split('/')[0];
    }
    return _repo.isNotEmpty ? _repo : 'Guest User';
  }

  // --- النهاية: الأكواد الجديدة ---

  // Getters للوصول إلى البيانات من الواجهات
  String get token => _token;
  String get repo => _repo;
  String get branch => _branch;
  bool get isLoading => _isLoading;
  String get statusMessage => _statusMessage;
  List<dynamic> get artifacts => _artifacts;

  GitHubProvider() {
    loadSettings(); // تحميل الإعدادات تلقائياً عند تشغيل المزود
  }

  /// حفظ الإعدادات في ذاكرة الهاتف الدائمة
  Future<void> saveSettings(String token, String repo, String branch) async {
    _token = token;
    _repo = repo;
    _branch = branch;
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('gh_token', token);
    await prefs.setString('gh_repo', repo);
    await prefs.setString('gh_branch', branch);
    
    _statusMessage = 'تم تحديث الإعدادات بنجاح.';
    notifyListeners();
  }

  /// جلب الإعدادات المخزنة عند تشغيل التطبيق
  Future<void> loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('gh_token') ?? '';
    _repo = prefs.getString('gh_repo') ?? '';
    _branch = prefs.getString('gh_branch') ?? 'main';
    notifyListeners();
  }

  /// تنفيذ عملية النشر: فك الضغط، الرفع، وحقن الـ YAML
  Future<void> deployProject(Archive archive, ProjectType type, String option) async {
    if (!isConnected) {
      _statusMessage = 'خطأ: يرجى ضبط الإعدادات أولاً.';
      notifyListeners();
      return;
    }
    
    _isLoading = true;
    _statusMessage = 'جاري تحضير المحرك وحقن التعليمات...';
    notifyListeners();

    try {
      final yamlContent = YamlGenerator.generate(type, _branch, option);
      final yamlPath = '.github/workflows/cloudrelay_build.yml';

      // رفع كافة ملفات المشروع
      for (final file in archive) {
        if (file.isFile) {
          await _uploadToGitHub(file.name, base64Encode(file.content as List<int>));
        }
      }

      // حقن ملف الأتمتة (YAML)
      if (yamlContent.isNotEmpty) {
        await _uploadToGitHub(yamlPath, base64Encode(utf8.encode(yamlContent)));
      }

      _statusMessage = '🚀 تم النشر بنجاح! السحابة بدأت العمل الآن.';
    } catch (e) {
      _statusMessage = 'خطأ أثناء النشر: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// جلب قائمة الملفات المبنية (Artifacts) من GitHub Actions
  Future<void> fetchArtifacts() async {
    if (!isConnected) return;

    _isLoading = true;
    notifyListeners();

    try {
      final uri = Uri.parse('https://api.github.com/repos/$_repo/actions/artifacts');
      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'token $_token',
          'Accept': 'application/vnd.github.v3+json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _artifacts = data['artifacts'] ?? [];
      } else {
        _statusMessage = 'فشل جلب الملفات: ${response.statusCode}';
      }
    } catch (e) {
      _statusMessage = 'خطأ في جلب البيانات: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// الدالة المسؤولة عن مخاطبة GitHub API لرفع الملفات
  Future<void> _uploadToGitHub(String path, String base64Content) async {
    final uri = Uri.parse('https://api.github.com/repos/$_repo/contents/$path');
    
    // فحص ما إذا كان الملف موجوداً لجلب الـ SHA للتحديث
    String? sha;
    final check = await http.get(uri, headers: {'Authorization': 'token $_token'});
    if (check.statusCode == 200) {
      sha = jsonDecode(check.body)['sha'];
    }

    final response = await http.put(
      uri,
      headers: {
        'Authorization': 'token $_token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'message': 'CloudRelay: Automatic Deployment',
        'content': base64Content,
        'branch': _branch,
        if (sha != null) 'sha': sha,
      }),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('فشل رفع $path: ${response.body}');
    }
  }
}



        
