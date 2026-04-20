import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/github_provider.dart';
import 'package:url_launcher/url_launcher.dart';

class VaultScreen extends StatefulWidget {
  const VaultScreen({super.key});

  @override
  State<VaultScreen> createState() => _VaultScreenState();
}

class _VaultScreenState extends State<VaultScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<GitHubProvider>().fetchArtifacts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GitHubProvider>();

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () => provider.fetchArtifacts(),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Build Artifacts',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'هنا تجد نتائج البناء والتقارير الجاهزة للتحميل من GitHub.',
                style: TextStyle(color: Theme.of(context).hintColor),
              ),
              const SizedBox(height: 20),
              
              if (provider.isLoading)
                const Expanded(child: Center(child: CircularProgressIndicator()))
              else if (provider.artifacts.isEmpty)
                Expanded(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.inventory_2_outlined, size: 64, color: Colors.grey.withOpacity(0.5)),
                        const SizedBox(height: 16),
                        const Text('لا توجد ملفات حالياً', style: TextStyle(color: Colors.grey)),
                        TextButton(
                          onPressed: () => provider.fetchArtifacts(),
                          child: const Text('تحديث القائمة'),
                        ),
                      ],
                    ),
                  ),
                )
              else
                Expanded(
                  child: ListView.builder(
                    itemCount: provider.artifacts.length,
                    itemBuilder: (context, index) {
                      final item = provider.artifacts[index];
                      final sizeInMB = (item['size_in_bytes'] / (1024 * 1024)).toStringAsFixed(2);
                      
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          // تصحيح الخطأ: استخدام side بدلاً من border
                          side: BorderSide(color: Theme.of(context).dividerColor),
                        ),
                        child: ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.blue.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(
                              _getIconForName(item['name']),
                              color: Colors.blue,
                            ),
                          ),
                          title: Text(
                            item['name'],
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text('حجم الملف: $sizeInMB MB • ينتهي في: ${item['expires_at'].toString().split('T')[0]}'),
                          trailing: IconButton(
                            icon: const Icon(Icons.download_rounded, color: Colors.green),
                            onPressed: () => _openGitHubRepo(provider),
                          ),
                        ),
                      );
                    },
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getIconForName(String name) {
    if (name.toLowerCase().contains('apk')) return Icons.android;
    if (name.toLowerCase().contains('report')) return Icons.assessment;
    if (name.toLowerCase().contains('zip')) return Icons.folder_zip;
    return Icons.insert_drive_file;
  }

  void _openGitHubRepo(GitHubProvider provider) async {
    if (provider.artifacts.isEmpty) return;
    
    final repoInfo = provider.artifacts.first['url'].split('/repos/')[1].split('/actions')[0];
    final url = Uri.parse('https://github.com/$repoInfo/actions');
    
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }
}
