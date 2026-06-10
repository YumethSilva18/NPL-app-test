import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nplpredictor.com' },
    update: {},
    create: {
      email: 'admin@nplpredictor.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create analyst user
  const analystPassword = await bcrypt.hash('Analyst123!', 12);
  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@nplpredictor.com' },
    update: {},
    create: {
      email: 'analyst@nplpredictor.com',
      password: analystPassword,
      firstName: 'John',
      lastName: 'Analyst',
      role: 'ANALYST',
      isActive: true,
    },
  });
  console.log('✅ Analyst user created:', analyst.email);

  // Create ML model entry
  const model = await prisma.mLModel.upsert({
    where: { name: 'npl-classifier-v1' },
    update: {},
    create: {
      name: 'npl-classifier-v1',
      version: '1.0.0',
      description: 'Primary NPL risk classification model',
      modelType: 'classification',
      framework: 'scikit-learn',
      isActive: true,
      isProduction: true,
      inputFeatures: {
        features: [
          'credit_score',
          'income',
          'loan_amount',
          'loan_term',
          'employment_years',
          'debt_to_income_ratio',
          'loan_to_value_ratio',
          'interest_rate',
          'payment_history_score',
          'previous_defaults',
          'age',
          'collateral_value',
          'account_age',
          'utilization_ratio',
          'monthly_installment',
        ],
      },
      outputSchema: {
        npl_probability: 'float',
        confidence: 'float',
      },
      metrics: {
        accuracy: 0.89,
        precision: 0.87,
        recall: 0.85,
        f1_score: 0.86,
      },
      activatedAt: new Date(),
    },
  });
  console.log('✅ ML model registered:', model.name);

  // Create default settings
  const settings = [
    { key: 'health_check_interval', value: 30, category: 'system' },
    { key: 'low_risk_threshold', value: 25, category: 'risk' },
    { key: 'high_risk_threshold', value: 60, category: 'risk' },
    { key: 'show_success_notifications', value: true, category: 'ui' },
    { key: 'show_error_notifications', value: true, category: 'ui' },
    { key: 'email_alerts_enabled', value: false, category: 'notifications' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Default settings created');

  // Create sample predictions (for demo)
  const samplePredictions = [
    {
      customerId: 'CUST-2024-001',
      creditScore: 720,
      income: 95000,
      loanAmount: 250000,
      loanTerm: 360,
      employmentYears: 8,
      debtToIncomeRatio: 0.32,
      loanToValueRatio: 0.80,
      interestRate: 4.75,
      paymentHistoryScore: 88,
      previousDefaults: 0,
      age: 35,
      collateralValue: 312500,
      accountAge: 96,
      utilizationRatio: 0.35,
      monthlyInstallment: 1304,
      nplProbability: 0.12,
      riskLevel: 'Low',
      confidence: 0.89,
      recommendation: 'Low risk application with strong financials. Recommend approval.',
      decisionHint: 'Approve',
      userId: analyst.id,
    },
    {
      customerId: 'CUST-2024-002',
      creditScore: 650,
      income: 72000,
      loanAmount: 320000,
      loanTerm: 360,
      employmentYears: 4,
      debtToIncomeRatio: 0.42,
      loanToValueRatio: 0.88,
      interestRate: 5.5,
      paymentHistoryScore: 72,
      previousDefaults: 1,
      age: 42,
      collateralValue: 363636,
      accountAge: 48,
      utilizationRatio: 0.48,
      monthlyInstallment: 1817,
      nplProbability: 0.45,
      riskLevel: 'Medium',
      confidence: 0.82,
      recommendation: 'Medium risk with some concerning factors. Recommend additional review.',
      decisionHint: 'Review',
      userId: analyst.id,
    },
  ];

  for (const pred of samplePredictions) {
    await prisma.prediction.create({ data: pred as any });
  }
  console.log('✅ Sample predictions created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📝 Default credentials:');
  console.log('   Admin: admin@nplpredictor.com / Admin123!');
  console.log('   Analyst: analyst@nplpredictor.com / Analyst123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
