// Database storage implementation with Replit Auth support
import {
  users,
  testimonials,
  analyticsEvents,
  purchases,
  emailLeads,
  packageItems,
  type User,
  type UpsertUser,
  type Testimonial,
  type InsertTestimonial,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type Purchase,
  type InsertPurchase,
  type EmailLead,
  type InsertEmailLead,
  type PackageItem,
  type InsertPackageItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  getVisibleTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  updateTestimonialVisibility(id: string, isVisible: boolean): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;
  
  // Analytics operations
  trackEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsSummary(): Promise<any>;
  
  // Purchase operations
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchaseStatus(id: string, status: string): Promise<Purchase>;
  getRecentPurchases(limit?: number): Promise<Purchase[]>;
  getPurchaseByPaymentIntent(paymentIntentId: string): Promise<Purchase | undefined>;
  
  // Email lead operations
  createEmailLead(lead: InsertEmailLead): Promise<EmailLead>;
  getEmailLeadByEmail(email: string): Promise<EmailLead | undefined>;
  
  // Package item operations
  getAllPackageItems(): Promise<PackageItem[]>;
  getVisiblePackageItems(): Promise<PackageItem[]>;
  getPackageItemById(id: string): Promise<PackageItem | undefined>;
  createPackageItem(item: InsertPackageItem): Promise<PackageItem>;
  updatePackageItem(id: string, item: Partial<InsertPackageItem>): Promise<PackageItem>;
  deletePackageItem(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async getVisibleTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isVisible, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async getTestimonialById(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(testimonialData)
      .returning();
    return testimonial;
  }

  async updateTestimonial(id: string, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [testimonial] = await db
      .update(testimonials)
      .set(testimonialData)
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async updateTestimonialVisibility(id: string, isVisible: boolean): Promise<Testimonial> {
    const [testimonial] = await db
      .update(testimonials)
      .set({ isVisible })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // Analytics operations
  async trackEvent(eventData: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [event] = await db
      .insert(analyticsEvents)
      .values(eventData)
      .returning();
    return event;
  }

  async getAnalyticsSummary(): Promise<any> {
    // Total visitors (page views)
    const [visitorsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, "page_view"));

    // Total clicks
    const [clicksResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, "link_click"));

    // Total purchases
    const [purchasesCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(purchases)
      .where(eq(purchases.status, "completed"));

    // Total revenue
    const [revenueResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(purchases)
      .where(eq(purchases.status, "completed"));

    // Total email leads
    const [leadsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(emailLeads);

    // Recent purchases
    const recentPurchases = await db
      .select()
      .from(purchases)
      .orderBy(desc(purchases.createdAt))
      .limit(10);

    const totalVisitors = Number(visitorsResult?.count || 0);
    const totalPurchases = Number(purchasesCountResult?.count || 0);
    const totalRevenue = Number(revenueResult?.total || 0);
    const totalClicks = Number(clicksResult?.count || 0);
    const totalEmailLeads = Number(leadsResult?.count || 0);

    return {
      totalVisitors,
      totalClicks,
      totalPurchases,
      totalRevenue,
      totalEmailLeads,
      conversionRate: totalVisitors > 0 ? (totalPurchases / totalVisitors) * 100 : 0,
      avgOrderValue: totalPurchases > 0 ? totalRevenue / totalPurchases : 0,
      recentPurchases,
    };
  }

  // Purchase operations
  async createPurchase(purchaseData: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values(purchaseData)
      .returning();
    return purchase;
  }

  async updatePurchaseStatus(id: string, status: string): Promise<Purchase> {
    const [purchase] = await db
      .update(purchases)
      .set({ status })
      .where(eq(purchases.id, id))
      .returning();
    return purchase;
  }

  async getRecentPurchases(limit: number = 20): Promise<Purchase[]> {
    return await db
      .select()
      .from(purchases)
      .orderBy(desc(purchases.createdAt))
      .limit(limit);
  }

  async getPurchaseByPaymentIntent(paymentIntentId: string): Promise<Purchase | undefined> {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(eq(purchases.stripePaymentIntentId, paymentIntentId));
    return purchase;
  }

  // Email lead operations
  async createEmailLead(leadData: InsertEmailLead): Promise<EmailLead> {
    const [lead] = await db
      .insert(emailLeads)
      .values(leadData)
      .onConflictDoUpdate({
        target: emailLeads.email,
        set: {
          name: leadData.name,
          source: leadData.source,
        },
      })
      .returning();
    return lead;
  }

  async getEmailLeadByEmail(email: string): Promise<EmailLead | undefined> {
    const [lead] = await db
      .select()
      .from(emailLeads)
      .where(eq(emailLeads.email, email));
    return lead;
  }

  // Package item operations
  async getAllPackageItems(): Promise<PackageItem[]> {
    return await db
      .select()
      .from(packageItems)
      .orderBy(asc(packageItems.displayOrder), desc(packageItems.createdAt));
  }

  async getVisiblePackageItems(): Promise<PackageItem[]> {
    return await db
      .select()
      .from(packageItems)
      .where(eq(packageItems.isVisible, true))
      .orderBy(asc(packageItems.displayOrder), desc(packageItems.createdAt));
  }

  async getPackageItemById(id: string): Promise<PackageItem | undefined> {
    const [item] = await db
      .select()
      .from(packageItems)
      .where(eq(packageItems.id, id));
    return item;
  }

  async createPackageItem(itemData: InsertPackageItem): Promise<PackageItem> {
    const [item] = await db
      .insert(packageItems)
      .values(itemData)
      .returning();
    return item;
  }

  async updatePackageItem(id: string, itemData: Partial<InsertPackageItem>): Promise<PackageItem> {
    const [item] = await db
      .update(packageItems)
      .set({ ...itemData, updatedAt: new Date() })
      .where(eq(packageItems.id, id))
      .returning();
    return item;
  }

  async deletePackageItem(id: string): Promise<void> {
    await db.delete(packageItems).where(eq(packageItems.id, id));
  }
}

export const storage = new DatabaseStorage();
