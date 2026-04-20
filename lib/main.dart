import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
// استيراد الملفات التي سننشئها تباعاً
import 'providers/github_provider.dart';
import 'ui/screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => GitHubProvider()),
      ],
      child: const CloudRelayApp(),
    ),
  );
}

class CloudRelayApp extends StatelessWidget {
  const CloudRelayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CloudRelay',
      debugShowCheckedModeBanner: false,
      
      // إعدادات الثيم الفاتح (Light Theme)
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorSchemeSeed: Colors.blue,
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
        ),
      ),

      // إعدادات الثيم الداكن (Dark Theme)
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorSchemeSeed: Colors.blue,
        scaffoldBackgroundColor: const Color(0xFF0D1117),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
          backgroundColor: Color(0xFF010409),
        ),
      ),

      // الاعتماد على وضع النظام (System Mode)
      themeMode: ThemeMode.system,

      // نقطة البداية: شاشة البداية الاحترافية
      home: const SplashScreen(),
    );
  }
}

    