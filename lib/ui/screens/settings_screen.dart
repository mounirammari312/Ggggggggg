import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/github_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late TextEditingController _tokenController;
  late TextEditingController _repoController;
  late TextEditingController _branchController;

  @override
  void initState() {
    super.initState();
    final provider = context.read<GitHubProvider>();
    _tokenController = TextEditingController(text: provider.token);
    _repoController = TextEditingController(text: provider.repo);
    _branchController = TextEditingController(text: provider.branch);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GitHub Settings')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const Icon(Icons.settings_suggest, size: 80, color: Colors.blue),
            const SizedBox(height: 32),
            TextField(
              controller: _tokenController,
              decoration: const InputDecoration(labelText: 'GitHub Token', prefixIcon: Icon(Icons.lock)),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _repoController,
              decoration: const InputDecoration(labelText: 'Repository (user/repo)', prefixIcon: Icon(Icons.folder)),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _branchController,
              decoration: const InputDecoration(labelText: 'Default Branch', prefixIcon: Icon(Icons.call_split)),
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () {
                context.read<GitHubProvider>().saveSettings(
                  _tokenController.text.trim(),
                  _repoController.text.trim(),
                  _branchController.text.trim(),
                );
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('تم حفظ البيانات بنجاح!')));
                Navigator.pop(context);
              },
              child: const Text('حفظ الإعدادات'),
            ),
          ],
        ),
      ),
    );
  }
}