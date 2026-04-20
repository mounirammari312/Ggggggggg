class YamlTemplates {
  // قالب بناء APK لمشاريع فلاتر (محدث للإصدار v4)
  static String flutterBuild(String branch) => '''
name: Flutter Build APK
on:
  push:
    branches: [ "$branch" ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
      - run: flutter pub get
      - run: flutter build apk --release
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: release-apk
          path: build/app/outputs/flutter-apk/app-release.apk
''';

  // قالب تشغيل أدوات SEO - بايثون (محدث للإصدار v5 و v4)
  static String pythonSEO(String branch) => '''
name: Python SEO Auditor
on:
  push:
    branches: [ "$branch" ]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      - run: pip install -r requirements.txt
      - run: python main.py
      - name: Save Results
        uses: actions/upload-artifact@v4
        with:
          name: seo-report
          path: reports/
''';

  // قالب النشر لمواقع الويب الثابتة (محدث للإصدارات الجديدة)
  static String staticWeb(String branch) => '''
name: Deploy Static Web
on:
  push:
    branches: [ "$branch" ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
''';
}

        
