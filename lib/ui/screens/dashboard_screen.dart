import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:provider/provider.dart';
import 'package:archive/archive.dart';
import 'dart:io';
import '../../../core/detector/project_detector.dart';
import '../../../models/project_type.dart';
import '../../../providers/github_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isProcessing = false;
  Archive? _currentArchive;

  // دالة اختيار الملف وفحصه
  Future<void> _pickAndDetectFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['zip'],
    );

    if (result != null) {
      setState(() => _isProcessing = true);
      
      try {
        final file = File(result.files.single.path!);
        final bytes = await file.readAsBytes();
        
        // فك الضغط في الذاكرة للتحليل
        _currentArchive = ZipDecoder().decodeBytes(bytes);
        
        // تشغيل المحقق الذكي
        final identity = ProjectDetector.detect(bytes);

        setState(() => _isProcessing = false);

        // إظهار النتائج للحوار التفاعلي
        if (mounted) {
          _showDeploymentDialog(identity);
        }
      } catch (e) {
        setState(() => _isProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('خطأ في معالجة الملف: $e')),
        );
      }
    }
  }

  // الحوار التفاعلي (القرار النهائي للمستخدم)
  void _showDeploymentDialog(ProjectIdentity identity) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(identity.icon, size: 60, color: Colors.blue),
            const SizedBox(height: 16),
            Text(identity.displayName, 
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(identity.description, 
                textAlign: TextAlign.center, 
                style: const TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),
            const Divider(),
            const Text('ما هي خطة العمل؟', 
                style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            
            if (identity.type == ProjectType.flutter) ...[
              _buildOptionTile(context, Icons.android, 'Build Release APK', 
                  'تجميع نسخة النشر النهائية وحقن YAML', identity.type, 'release'),
              _buildOptionTile(context, Icons.bug_report, 'Build Debug APK', 
                  'تجميع نسخة الاختبار السريع', identity.type, 'debug'),
            ],
            
            if (identity.type == ProjectType.python) ...[
              _buildOptionTile(context, Icons.search, 'Setup SEO Tool', 
                  'تشغيل السكربت كأداة فحص أرشفة', identity.type, 'seo'),
              _buildOptionTile(context, Icons.smart_toy, 'Setup Telegram Bot', 
                  'تشغيل السكربت كبوت تفاعلي', identity.type, 'bot'),
            ],

            if (identity.type == ProjectType.staticWeb) ...[
              _buildOptionTile(context, Icons.web, 'Deploy to GitHub Pages', 
                  'نشر الموقع فوراً وتفعيل الرابط الحقيقي', identity.type, 'deploy'),
            ],

            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('إلغاء'),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildOptionTile(BuildContext context, IconData icon, String title, 
      String subtitle, ProjectType type, String option) {
    final provider = context.read<GitHubProvider>();
    
    return ListTile(
      leading: Icon(icon, color: Colors.blue),
      title: Text(title),
      subtitle: Text(subtitle),
      onTap: () {
        Navigator.pop(context); // إغلاق الحوار
        if (_currentArchive != null) {
          provider.deployProject(_currentArchive!, type, option);
          // الانتقال التلقائي لشاشة المراقبة لمتابعة التقدم
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('بدأت عملية النشر... انتقل لشاشة المراقبة')),
          );
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GitHubProvider>();

    return Scaffold(
      body: Center(
        child: provider.isLoading || _isProcessing
          ? Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const CircularProgressIndicator(),
                const SizedBox(height: 20),
                Text(provider.statusMessage.isEmpty ? 'جاري الفحص...' : provider.statusMessage),
              ],
            )
          : Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.cloud_upload_outlined, 
                    size: 100, color: Theme.of(context).primaryColor.withOpacity(0.5)),
                const SizedBox(height: 24),
                const Text(
                  'جاهز لاستلام مشروعك الجديد',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                const Text('ارفع ملف ZIP ليقوم المحقق الذكي بعمله', 
                    style: TextStyle(color: Colors.grey)),
                const SizedBox(height: 40),
                ElevatedButton.icon(
                  onPressed: _pickAndDetectFile,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  ),
                  icon: const Icon(Icons.add_circle_outline),
                  label: const Text('اختيار ملف ZIP', style: TextStyle(fontSize: 16)),
                ),
              ],
            ),
      ),
    );
  }
}

             
