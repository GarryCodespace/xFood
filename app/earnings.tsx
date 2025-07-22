import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Download,
  ChefHat,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react-native';

// Mock earnings data
const mockEarnings = {
  totalEarnings: 1247.83,
  thisMonth: 324.50,
  lastMonth: 298.75,
  pendingPayouts: 89.25,
  totalSales: 47,
  recipeEarnings: 456.30,
  pastryEarnings: 791.53,
  platformFees: 124.78,
};

const mockTransactions = [
  {
    id: '1',
    type: 'recipe' as const,
    title: 'Classic Vanilla Sponge Cake',
    amount: 4.99,
    platformFee: 0.40,
    netAmount: 4.59,
    date: '2025-07-22T10:30:00Z',
    status: 'completed' as const,
  },
  {
    id: '2',
    type: 'pastry' as const,
    title: 'Artisan Sourdough Bread',
    amount: 16.00,
    platformFee: 1.28,
    netAmount: 14.72,
    date: '2025-07-21T14:15:00Z',
    status: 'completed' as const,
  },
  {
    id: '3',
    type: 'recipe' as const,
    title: 'Perfect Chocolate Croissants',
    amount: 12.99,
    platformFee: 1.04,
    netAmount: 11.95,
    date: '2025-07-20T09:45:00Z',
    status: 'pending' as const,
  },
];

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const router = useRouter();

  const getChangePercentage = () => {
    const change = ((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth) * 100;
    return change;
  };

  const isPositiveChange = getChangePercentage() > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings Dashboard</Text>
        <Pressable style={styles.downloadButton}>
          <Download size={20} color={Colors.primary} />
          <Text style={styles.downloadText}>Export</Text>
        </Pressable>
      </View>

      {/* Total Earnings Card */}
      <View style={styles.totalEarningsCard}>
        <View style={styles.earningsHeader}>
          <TrendingUp size={24} color={Colors.success} />
          <Text style={styles.totalEarningsLabel}>Total Earnings</Text>
        </View>
        <Text style={styles.totalEarningsAmount}>
          ${mockEarnings.totalEarnings.toFixed(2)}
        </Text>
        
        <View style={styles.changeContainer}>
          {isPositiveChange ? (
            <ArrowUpRight size={16} color={Colors.success} />
          ) : (
            <ArrowDownRight size={16} color={Colors.error} />
          )}
          <Text style={[
            styles.changeText,
            { color: isPositiveChange ? Colors.success : Colors.error }
          ]}>
            {Math.abs(getChangePercentage()).toFixed(1)}% vs last month
          </Text>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['week', 'month', 'year'] as const).map((period) => (
          <Pressable
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedPeriodButton
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.selectedPeriodButtonText
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <Text style={styles.statValue}>${mockEarnings.thisMonth.toFixed(2)}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <DollarSign size={20} color={Colors.textLight} />
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <Text style={styles.statValue}>${mockEarnings.pendingPayouts.toFixed(2)}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <ChefHat size={20} color={Colors.primary} />
            <Text style={styles.statLabel}>Recipe Sales</Text>
          </View>
          <Text style={styles.statValue}>${mockEarnings.recipeEarnings.toFixed(2)}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <ShoppingBag size={20} color={Colors.primary} />
            <Text style={styles.statLabel}>Pastry Sales</Text>
          </View>
          <Text style={styles.statValue}>${mockEarnings.pastryEarnings.toFixed(2)}</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {mockTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <View style={styles.transactionIcon}>
                {transaction.type === 'recipe' ? (
                  <ChefHat size={16} color={Colors.primary} />
                ) : (
                  <ShoppingBag size={16} color={Colors.primary} />
                )}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={styles.transactionAmounts}>
                <Text style={styles.transactionAmount}>
                  +${transaction.netAmount.toFixed(2)}
                </Text>
                <Text style={styles.transactionFee}>
                  Fee: ${transaction.platformFee.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={[
              styles.statusBadge,
              { backgroundColor: transaction.status === 'completed' ? Colors.success : Colors.primary }
            ]}>
              <Text style={styles.statusText}>
                {transaction.status === 'completed' ? 'Completed' : 'Pending'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Payout Information */}
      <View style={styles.payoutCard}>
        <Text style={styles.payoutTitle}>Next Payout</Text>
        <Text style={styles.payoutDescription}>
          Your earnings are automatically paid out every Friday. 
          Pending earnings will be included in your next payout.
        </Text>
        <View style={styles.payoutAmount}>
          <Text style={styles.payoutAmountLabel}>Next payout amount:</Text>
          <Text style={styles.payoutAmountValue}>
            ${mockEarnings.pendingPayouts.toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadText: {
    color: Colors.primary,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  totalEarningsCard: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalEarningsLabel: {
    fontSize: 16,
    color: Colors.textLight,
    marginLeft: 8,
  },
  totalEarningsAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedPeriodButton: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  selectedPeriodButtonText: {
    color: Colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginRight: '2%',
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  transactionsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  transactionAmounts: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.success,
    marginBottom: 2,
  },
  transactionFee: {
    fontSize: 12,
    color: Colors.textLight,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600' as const,
  },
  payoutCard: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  payoutTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  payoutDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  payoutAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  payoutAmountLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  payoutAmountValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.success,
  },
});