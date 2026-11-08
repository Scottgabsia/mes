import { lazy } from "react";

export const ServicesView = lazy(() =>
  import("./ServicesView").then((m) => ({ default: m.ServicesView }))
);
export const IntelligenceView = lazy(() =>
  import("./IntelligenceView").then((m) => ({ default: m.IntelligenceView }))
);
export const RecoveryConfirmationView = lazy(() =>
  import("./RecoveryConfirmationView").then((m) => ({
    default: m.RecoveryConfirmationView,
  }))
);
export const ClientDashboardView = lazy(() =>
  import("./ClientDashboardView").then((m) => ({
    default: m.ClientDashboardView,
  }))
);
export const ChainTraceabilityView = lazy(() =>
  import("./ChainTraceabilityView").then((m) => ({
    default: m.ChainTraceabilityView,
  }))
);
export const ExchangeRecoveryView = lazy(() =>
  import("./ExchangeRecoveryView").then((m) => ({
    default: m.ExchangeRecoveryView,
  }))
);
export const LegalEnforcementView = lazy(() =>
  import("./LegalEnforcementView").then((m) => ({
    default: m.LegalEnforcementView,
  }))
);
export const RiskMonitoringView = lazy(() =>
  import("./RiskMonitoringView").then((m) => ({
    default: m.RiskMonitoringView,
  }))
);
export const ToolsView = lazy(() =>
  import("./ToolsView").then((m) => ({ default: m.ToolsView }))
);
export const ISO27001View = lazy(() =>
  import("./ISO27001View").then((m) => ({ default: m.ISO27001View }))
);
export const SOC2View = lazy(() =>
  import("./SOC2View").then((m) => ({ default: m.SOC2View }))
);
export const GDPRView = lazy(() =>
  import("./GDPRView").then((m) => ({ default: m.GDPRView }))
);
export const AMLKYCView = lazy(() =>
  import("./AMLKYCView").then((m) => ({ default: m.AMLKYCView }))
);
export const CaseLookupView = lazy(() =>
  import("./CaseLookupView").then((m) => ({ default: m.CaseLookupView }))
);
export const AboutView = lazy(() =>
  import("./AboutView").then((m) => ({ default: m.AboutView }))
);
export const BlogView = lazy(() =>
  import("./BlogView").then((m) => ({ default: m.BlogView }))
);
export const PrivacyPolicyView = lazy(() =>
  import("./PrivacyPolicyView").then((m) => ({ default: m.PrivacyPolicyView }))
);
export const TermsOfServiceView = lazy(() =>
  import("./TermsOfServiceView").then((m) => ({
    default: m.TermsOfServiceView,
  }))
);
export const ReviewsView = lazy(() =>
  import("./ReviewsView").then((m) => ({ default: m.ReviewsView }))
);
export const SubmitReviewView = lazy(() =>
  import("./SubmitReviewView").then((m) => ({ default: m.SubmitReviewView }))
);
export const AdminLoginView = lazy(() =>
  import("./AdminLoginView").then((m) => ({ default: m.AdminLoginView }))
);
export const FAQView = lazy(() =>
  import("./FAQView").then((m) => ({ default: m.FAQView }))
);
export const CaseManagerView = lazy(() => import("./AdminDashboardView"));
