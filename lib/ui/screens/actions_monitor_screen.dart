import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/github_provider.dart';

class ActionsMonitorScreen extends StatelessWidget {
  const ActionsMonitorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GitHubProvider>();

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Deployment Status',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'تتبع حالة الرفع والحقن البرمجي في الوقت الفعلي',
              style: TextStyle(color: Theme.of(context).hintColor),
            ),
            const SizedBox(height: 32),
            
            // صندوق الحالة
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Theme.of(context).dividerColor),
              ),
              child: Column(
                children: [
                  if (provider.isLoading) ...[
                    const CircularProgressIndicator(),
                    const SizedBox(height: 20),
                  ] else ...[
                    Icon(
                      provider.statusMessage.contains('نجاح') || provider.statusMessage.contains('🚀')
                          ? Icons.check_circle_outline
                          : Icons.info_outline,
                      size: 48,
                      color: provider.statusMessage.contains('نجاح') || provider.statusMessage.contains('🚀')
                          ? Colors.green
                          : Colors.blue,
                    ),
                    const SizedBox(height: 16),
                  ],
                  Text(
                    provider.statusMessage.isEmpty 
                        ? 'لا توجد عمليات جارية حالياً' 
                        : provider.statusMessage,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            const Text('Next Steps:', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildStepTile(Icons.cloud_done, 'Code Uploaded', provider.statusMessage.isNotEmpty),
            _buildStepTile(Icons.code, 'YAML Workflow Injected', provider.statusMessage.contains('نجاح')),
            _buildStepTile(Icons.settings_remote, 'GitHub Action Triggered', provider.statusMessage.contains('نجاح')),
          ],
        ),
      ),
    );
  }

  Widget _buildStepTile(IconData icon, String label, bool isDone) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Icon(icon, color: isDone ? Colors.green : Colors.grey, size: 20),
          const SizedBox(width: 12),
          Text(label, style: TextStyle(color: isDone ? Colors.white : Colors.grey)),
          const Spacer(),
          if (isDone) const Icon(Icons.done, color: Colors.green, size: 16),
        ],
      ),
    );
  }
}
