import 'package:flutter/material.dart';
import 'package:provider/provider.dart'; // تأكد من استيراد Provider
import '../screens/dashboard_screen.dart';
import '../screens/actions_monitor_screen.dart';
import '../screens/vault_screen.dart';
import '../screens/settings_screen.dart';
import '../../providers/github_provider.dart'; // استيراد البروفايدر

class HomeLayout extends StatefulWidget {
  const HomeLayout({super.key});

  @override
  State<HomeLayout> createState() => _HomeLayoutState();
}

class _HomeLayoutState extends State<HomeLayout> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const ActionsMonitorScreen(),
    const VaultScreen(),
  ];

  final List<String> _titles = [
    'CloudRelay Dashboard',
    'Active Actions',
    'Secure Vault',
  ];

  @override
  Widget build(BuildContext context) {
    // مراقبة حالة الـ Provider لتحديث الواجهة فورياً
    final provider = context.watch<GitHubProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _titles[_selectedIndex],
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      
      drawer: Drawer(
        child: Column(
          children: [
            // رأس القائمة الجانبية الديناميكي
            UserAccountsDrawerHeader(
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(
                  Icons.code, // أيقونة تعبر عن GitHub/Coding
                  size: 40, 
                  color: provider.isConnected ? Colors.blue : Colors.grey
                ),
              ),
              accountName: Text(
                provider.githubUsername,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              accountEmail: Row(
                children: [
                  // شارة الاتصال (Connection Indicator)
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: provider.isConnected ? Colors.green : Colors.red,
                      boxShadow: [
                        if (provider.isConnected)
                          BoxShadow(
                            color: Colors.green.withOpacity(0.5),
                            blurRadius: 5,
                            spreadRadius: 2,
                          )
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    provider.isConnected ? 'Status: Online & Ready' : 'Status: Offline (Configure Now)',
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
              decoration: BoxDecoration(
                color: provider.isConnected ? Colors.blue.shade800 : Colors.grey.shade800,
              ),
            ),
            
            // تفعيل العناصر المعطلة عبر رسائل توضيحية أو شاشات
            ListTile(
              leading: const Icon(Icons.history),
              title: const Text('Build History'),
              subtitle: const Text('سجل العمليات السابقة'),
              onTap: () {
                Navigator.pop(context);
                _showFeatureUnderDevelopment(context, 'Build History');
              },
            ),
            ListTile(
              leading: const Icon(Icons.vpn_key),
              title: const Text('Stored Secrets'),
              subtitle: const Text('إدارة مفاتيح API الآمنة'),
              onTap: () {
                Navigator.pop(context);
                _showFeatureUnderDevelopment(context, 'Secrets Manager');
              },
            ),
            const Divider(),
            
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('App Settings'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const SettingsScreen()),
                );
              },
            ),
            
            ListTile(
              leading: const Icon(Icons.help_outline),
              title: const Text('Documentation'),
              onTap: () {
                Navigator.pop(context);
                _showFeatureUnderDevelopment(context, 'Help Center');
              },
            ),
            const Spacer(),
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'CloudRelay v1.0.0',
                style: TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ),
          ],
        ),
      ),

      body: _screens[_selectedIndex],

      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (int index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.rocket_launch_outlined),
            selectedIcon: Icon(Icons.rocket_launch),
            label: 'Launch',
          ),
          NavigationDestination(
            icon: Icon(Icons.track_changes_outlined),
            selectedIcon: Icon(Icons.track_changes),
            label: 'Monitor',
          ),
          NavigationDestination(
            icon: Icon(Icons.inventory_2_outlined),
            selectedIcon: Icon(Icons.inventory_2),
            label: 'Vault',
          ),
        ],
      ),
    );
  }

  // دالة مساعدة لإظهار تنبيه بسيط للميزات التي ستبنى لاحقاً
  void _showFeatureUnderDevelopment(BuildContext context, String featureName) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('ميزة $featureName ستكون متاحة في التحديث القادم.'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
