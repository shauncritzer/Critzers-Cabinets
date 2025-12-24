export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",

  // Stripe configuration
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  // Email configuration (Gmail SMTP)
  emailHost: process.env.EMAIL_HOST ?? "smtp.gmail.com",
  emailPort: parseInt(process.env.EMAIL_PORT ?? "587"),
  emailUser: process.env.EMAIL_USER ?? "",
  emailPassword: process.env.EMAIL_PASSWORD ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "info@critzerscabinets.com",
};
