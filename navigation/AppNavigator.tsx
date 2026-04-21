import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, MessageSquare, User, LayoutDashboard } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SHADOW, RADIUS } from '../lib/theme';
import { useAppStore } from '../lib/store';

// Public Screens
import HomeScreen from '../screens/public/HomeScreen';
import SearchScreen from '../screens/public/SearchScreen';
import ProductDetailScreen from '../screens/public/ProductDetailScreen';
import SupplierStoreScreen from '../screens/public/SupplierStoreScreen';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Buyer Screens
import BuyerDashboardScreen from '../screens/buyer/BuyerDashboardScreen';
import OrdersScreen from '../screens/buyer/OrdersScreen';
import RFQsScreen from '../screens/buyer/RFQsScreen';
import MessagesScreen from '../screens/buyer/MessagesScreen';
import FavoritesScreen from '../screens/buyer/FavoritesScreen';
import SettingsScreen from '../screens/buyer/SettingsScreen';

// Supplier Screens
import SupplierDashboardScreen from '../screens/supplier/SupplierDashboardScreen';
import SupplierProductsScreen from '../screens/supplier/SupplierProductsScreen';
import AddProductScreen from '../screens/supplier/AddProductScreen';
import SupplierAnalyticsScreen from '../screens/supplier/SupplierAnalyticsScreen';
import BadgesScreen from '../screens/supplier/BadgesScreen';
import AdsScreen from '../screens/supplier/AdsScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminBadgesScreen from '../screens/admin/AdminBadgesScreen';

// Other
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BuyerTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          ...SHADOW.lg,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t('nav.home'), tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: t('nav.search'), tabBarIcon: ({ color, size }) => <Search size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarLabel: t('nav.messages'), tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />, tabBarBadge: 2 }}
      />
      <Tab.Screen
        name="BuyerDashboard"
        component={BuyerDashboardScreen}
        options={{ tabBarLabel: t('nav.account'), tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function SupplierTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          ...SHADOW.lg,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="SupplierHome"
        component={HomeScreen}
        options={{ tabBarLabel: t('nav.home'), tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: t('nav.search'), tabBarIcon: ({ color, size }) => <Search size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarLabel: t('nav.messages'), tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} /> }}
      />
      <Tab.Screen
        name="SupplierDashboard"
        component={SupplierDashboardScreen}
        options={{ tabBarLabel: t('nav.dashboard'), tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primaryDark,
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          ...SHADOW.lg,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ tabBarLabel: t('admin.dashboard'), tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} /> }}
      />
      <Tab.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ tabBarLabel: t('admin.users'), tabBarIcon: ({ color, size }) => <User size={size} color={color} />, tabBarBadge: 5 }}
      />
      <Tab.Screen
        name="AdminBadges"
        component={AdminBadgesScreen}
        options={{ tabBarLabel: t('admin.badges'), tabBarIcon: ({ color, size }) => <Search size={size} color={color} />, tabBarBadge: 4 }}
      />
      <Tab.Screen
        name="AdminSettings"
        component={SettingsScreen}
        options={{ tabBarLabel: t('nav.settings'), tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack({ role }: { role: string }) {
  const TabNavigator = role === 'supplier' ? SupplierTabs : role === 'admin' ? AdminTabs : BuyerTabs;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="SupplierStore" component={SupplierStoreScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="BuyerOrders" component={OrdersScreen} />
      <Stack.Screen name="BuyerRFQs" component={RFQsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="SupplierProducts" component={SupplierProductsScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="EditProduct" component={AddProductScreen} />
      <Stack.Screen name="SupplierAnalytics" component={SupplierAnalyticsScreen} />
      <Stack.Screen name="SupplierBadges" component={BadgesScreen} />
      <Stack.Screen name="SupplierAds" component={AdsScreen} />
      <Stack.Screen name="SupplierOrders" component={OrdersScreen} />
      <Stack.Screen name="SupplierRFQs" component={RFQsScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="AdminBadges" component={AdminBadgesScreen} />
      <Stack.Screen name="AdminSuppliers" component={AdminUsersScreen} />
      <Stack.Screen name="AdminProducts" component={SupplierProductsScreen} />
      <Stack.Screen name="AdminOrders" component={OrdersScreen} />
      <Stack.Screen name="AdminAds" component={AdsScreen} />
      <Stack.Screen name="AdminAnalytics" component={SupplierAnalyticsScreen} />
      <Stack.Screen name="SupplierProfile" component={SupplierStoreScreen} />
      <Stack.Screen name="OrderDetail" component={OrdersScreen} />
      <Stack.Screen name="RFQDetail" component={RFQsScreen} />
      <Stack.Screen name="BuyerReviews" component={BuyerDashboardScreen} />
      <Stack.Screen name="Suppliers" component={SearchScreen} />
      <Stack.Screen name="Categories" component={SearchScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAppStore();

  return (
    <NavigationContainer>
      {user ? <MainStack role={user.role} /> : <AuthStack />}
    </NavigationContainer>
  );
}
