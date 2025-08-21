import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// Use Prisma enum values directly
const UserRole = {
  CLIENT: 'CLIENT' as const,
  CLEANER: 'CLEANER' as const,
  ADMIN: 'ADMIN' as const,
};

const BookingStatus = {
  REQUESTED: 'REQUESTED' as const,
  ACCEPTED: 'ACCEPTED' as const,
  ON_THE_WAY: 'ON_THE_WAY' as const,
  ARRIVED: 'ARRIVED' as const,
  IN_PROGRESS: 'IN_PROGRESS' as const,
  COMPLETED: 'COMPLETED' as const,
  CLIENT_CONFIRMED: 'CLIENT_CONFIRMED' as const,
  CANCELLED: 'CANCELLED' as const,
  DISPUTED: 'DISPUTED' as const,
};

const VerificationDocumentStatus = {
  PENDING: 'PENDING' as const,
  APPROVED: 'APPROVED' as const,
  REJECTED: 'REJECTED' as const,
};

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.bookingEvent.deleteMany();
  await prisma.bookingAddon.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.servicePhoto.deleteMany();
  await prisma.serviceAddon.deleteMany();
  await prisma.cleanerService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.verificationDocument.deleteMany();
  await prisma.cleanerLiveLocation.deleteMany();
  await prisma.location.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.debtThreshold.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.fraudFlag.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.emailOTP.deleteMany();
  await prisma.session.deleteMany();
  await prisma.device.deleteMany();
  await prisma.cleanerProfile.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for all test users
  const passwordHash = await argon2.hash('password123');

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cleanmarketplace.com',
      passwordHash,
      role: UserRole.ADMIN,
      emailVerified: true,
      phone: '+212600000001',
    },
  });

  // Create service categories
  const categories = await Promise.all([
    prisma.serviceCategory.create({
      data: {
        name: 'Car Washing',
        description: 'Professional car washing and detailing services',
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: 'Interior Cleaning',
        description: 'Deep cleaning for car interiors',
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: 'Detailing',
        description: 'Premium car detailing and restoration',
      },
    }),
  ]);

  // Create base services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        categoryId: categories[0].id,
        name: 'Basic Exterior Wash',
        description: 'Exterior wash with soap and rinse',
        baseDurationMin: 30,
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[0].id,
        name: 'Premium Wash & Wax',
        description: 'Exterior wash, wax, and tire shine',
        baseDurationMin: 60,
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[1].id,
        name: 'Interior Vacuum & Clean',
        description: 'Complete interior cleaning and vacuuming',
        baseDurationMin: 45,
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[2].id,
        name: 'Full Car Detailing',
        description: 'Complete exterior and interior detailing',
        baseDurationMin: 120,
      },
    }),
  ]);

  // Create locations in Casablanca
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        label: 'Casablanca City Center',
        lat: 33.5731,
        lng: -7.5898,
        addressText: 'Place Mohammed V, Casablanca, Morocco',
      },
    }),
    prisma.location.create({
      data: {
        label: 'Maarif District',
        lat: 33.5888,
        lng: -7.6114,
        addressText: 'Maarif, Casablanca, Morocco',
      },
    }),
    prisma.location.create({
      data: {
        label: 'Ain Diab Beach',
        lat: 33.5547,
        lng: -7.6916,
        addressText: 'Ain Diab, Casablanca, Morocco',
      },
    }),
  ]);

  // Create test clients
  const clients = [];
  for (let i = 1; i <= 5; i++) {
    const client = await prisma.user.create({
      data: {
        email: `client${i}@test.com`,
        passwordHash,
        role: UserRole.CLIENT,
        emailVerified: true,
        phone: `+21260000001${i}`,
        clientProfile: {
          create: {
            firstName: `Client${i}`,
            lastName: 'TestUser',
            defaultLocationId: locations[i % locations.length].id,
          },
        },
        locations: {
          create: {
            label: `Client ${i} Home`,
            lat: 33.5731 + (Math.random() - 0.5) * 0.1,
            lng: -7.5898 + (Math.random() - 0.5) * 0.1,
            addressText: `${i} Test Street, Casablanca, Morocco`,
          },
        },
      },
    });
    clients.push(client);
  }

  // Create test cleaners with wallets
  const cleaners = [];
  for (let i = 1; i <= 8; i++) {
    const cleaner = await prisma.user.create({
      data: {
        email: `cleaner${i}@test.com`,
        passwordHash,
        role: UserRole.CLEANER,
        emailVerified: true,
        phone: `+21260000020${i}`,
        cleanerProfile: {
          create: {
            businessName: `Clean Pro ${i}`,
            bio: `Professional cleaning service with ${i + 2} years of experience. Serving Casablanca area.`,
            ratingAvg: 4.0 + Math.random(),
            ratingCount: Math.floor(Math.random() * 50) + 10,
            isVerified: i <= 6, // First 6 cleaners are verified
            active: true,
            baseLocationId: locations[i % locations.length].id,
            completedJobsCount: Math.floor(Math.random() * 30) + (i <= 3 ? 15 : 5), // Some have passed free quota
            freeJobsUsed: Math.min(20, Math.floor(Math.random() * 25)),
          },
        },
        wallet: {
          create: {
            balanceMad: i <= 4 ? Math.random() * 500 + 100 : Math.random() * 50 - 100, // Some have negative balance
          },
        },
        debtThresholds: {
          create: {
            debtLimitMad: -200,
          },
        },
      },
    });
    cleaners.push(cleaner);
  }

  // Create cleaner live locations
  for (const cleaner of cleaners.slice(0, 6)) {
    await prisma.cleanerLiveLocation.create({
      data: {
        cleanerUserId: cleaner.id,
        lat: 33.5731 + (Math.random() - 0.5) * 0.05,
        lng: -7.5898 + (Math.random() - 0.5) * 0.05,
      },
    });
  }

  // Create cleaner services with pricing
  const cleanerServices = [];
  for (const cleaner of cleaners) {
    for (const service of services.slice(0, Math.floor(Math.random() * 3) + 1)) {
      const cleanerService = await prisma.cleanerService.create({
        data: {
          cleanerUserId: cleaner.id,
          serviceId: service.id,
          priceMad: Math.floor(Math.random() * 200) + 80, // 80-280 MAD
          active: true,
        },
      });
      cleanerServices.push(cleanerService);

      // Add some addons
      if (Math.random() > 0.5) {
        await prisma.serviceAddon.create({
          data: {
            cleanerServiceId: cleanerService.id,
            name: 'Express Service',
            priceMad: 20,
            extraDurationMin: -15,
            active: true,
          },
        });
      }

      if (Math.random() > 0.6) {
        await prisma.serviceAddon.create({
          data: {
            cleanerServiceId: cleanerService.id,
            name: 'Premium Products',
            priceMad: 35,
            extraDurationMin: 10,
            active: true,
          },
        });
      }
    }
  }

  // Create verification documents for cleaners
  for (const cleaner of cleaners) {
    const docTypes = ['ID_CARD', 'BUSINESS_LICENSE', 'VEHICLE_REGISTRATION'];
    for (const docType of docTypes) {
      await prisma.verificationDocument.create({
        data: {
          cleanerUserId: cleaner.id,
          type: docType,
          url: `/uploads/documents/${cleaner.id}_${docType.toLowerCase()}.pdf`,
          status: cleaner.cleanerProfile?.isVerified 
            ? VerificationDocumentStatus.APPROVED
            : Math.random() > 0.7 
              ? VerificationDocumentStatus.PENDING 
              : VerificationDocumentStatus.APPROVED,
          reviewedBy: cleaner.cleanerProfile?.isVerified ? admin.id : null,
          reviewedAt: cleaner.cleanerProfile?.isVerified ? new Date() : null,
        },
      });
    }
  }

  // Create sample bookings with different statuses
  const bookings = [];
  for (let i = 0; i < 20; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const cleanerService = cleanerServices[Math.floor(Math.random() * cleanerServices.length)];
    const cleaner = cleaners.find(c => c.id === cleanerService.cleanerUserId);
    
    const statusOptions = [
      BookingStatus.REQUESTED,
      BookingStatus.ACCEPTED,
      BookingStatus.ON_THE_WAY,
      BookingStatus.IN_PROGRESS,
      BookingStatus.COMPLETED,
      BookingStatus.CLIENT_CONFIRMED,
      BookingStatus.CANCELLED,
    ];
    
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) - 15); // ±15 days

    const booking = await prisma.booking.create({
      data: {
        clientUserId: client.id,
        cleanerUserId: cleaner?.id,
        cleanerServiceId: cleanerService.id,
        scheduledAt: scheduledDate,
        addressText: `${Math.floor(Math.random() * 999) + 1} Test Street, Casablanca`,
        lat: 33.5731 + (Math.random() - 0.5) * 0.1,
        lng: -7.5898 + (Math.random() - 0.5) * 0.1,
        basePriceMad: cleanerService.priceMad,
        addonsTotal: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 20 : 0,
        totalPriceMad: cleanerService.priceMad + (Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 20 : 0),
        status,
      },
    });
    bookings.push(booking);

    // Create booking events
    await prisma.bookingEvent.create({
      data: {
        bookingId: booking.id,
        actorUserId: client.id,
        newStatus: BookingStatus.REQUESTED,
        meta: { 
          reference: `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          totalAmount: booking.totalPriceMad,
        },
      },
    });

    // Create reviews for completed bookings
    if (status === BookingStatus.CLIENT_CONFIRMED && cleaner && Math.random() > 0.3) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          clientUserId: client.id,
          cleanerUserId: cleaner.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          comment: [
            'Excellent service, very professional!',
            'Great job, car looks amazing!',
            'Fast and efficient, highly recommend!',
            'Professional service, will book again.',
            'Outstanding work, exceeded expectations!',
          ][Math.floor(Math.random() * 5)],
        },
      });
    }

    // Create commissions for confirmed bookings
    if (status === BookingStatus.CLIENT_CONFIRMED && cleaner) {
      const cleanerProfile = await prisma.cleanerProfile.findUnique({
        where: { userId: cleaner.id },
      });
      
      const isFreeJob = (cleanerProfile?.completedJobsCount || 0) < 20;
      const commissionAmount = isFreeJob ? 0 : booking.totalPriceMad * 0.07;

      await prisma.commission.create({
        data: {
          cleanerUserId: cleaner.id,
          bookingId: booking.id,
          percentage: isFreeJob ? 0 : 7.0,
          commissionMad: commissionAmount,
          status: 'APPLIED',
        },
      });

      // Create wallet transaction
      await prisma.walletTransaction.create({
        data: {
          walletOwnerUserId: cleaner.id,
          type: 'COMMISSION',
          amountMad: -commissionAmount,
          bookingId: booking.id,
          meta: {
            jobNumber: (cleanerProfile?.completedJobsCount || 0) + 1,
            commissionRate: isFreeJob ? 0 : 7.0,
            isFreeJob,
          },
        },
      });
    }
  }

  // Create some disputes
  const disputeBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED).slice(0, 2);
  for (const booking of disputeBookings) {
    await prisma.dispute.create({
      data: {
        bookingId: booking.id,
        openedByUserId: booking.clientUserId,
        reason: 'Service was not completed as expected. Several areas were missed and quality was below standard.',
        status: 'OPEN',
      },
    });
  }

  // Create support tickets
  for (let i = 0; i < 5; i++) {
    const user = [...clients, ...cleaners][Math.floor(Math.random() * (clients.length + cleaners.length))];
    await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject: [
          'Payment Issue',
          'Booking Problem',
          'Technical Support',
          'Account Question',
          'Service Inquiry',
        ][i],
        message: `This is a test support ticket #${i + 1} for testing the support system.`,
        channel: ['EMAIL', 'FORM', 'WHATSAPP'][Math.floor(Math.random() * 3)] as any,
        status: ['OPEN', 'IN_PROGRESS', 'RESOLVED'][Math.floor(Math.random() * 3)] as any,
      },
    });
  }

  // Create some fraud flags
  await prisma.fraudFlag.create({
    data: {
      userId: clients[0].id,
      type: 'SUSPICIOUS_CANCELLATION',
      severity: 'MEDIUM',
      reason: 'Client has cancelled multiple bookings within short time period',
    },
  });

  // Create wallet recharge transactions for cleaners
  for (const cleaner of cleaners.slice(0, 4)) {
    const rechargeAmount = Math.floor(Math.random() * 500) + 200;
    
    await prisma.walletTransaction.create({
      data: {
        walletOwnerUserId: cleaner.id,
        type: 'RECHARGE',
        amountMad: rechargeAmount,
        meta: {
          paymentId: `PAY-${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
          paymentMethod: 'PAYPAL',
          rechargeAmount,
        },
      },
    });
  }

  // Update cleaner ratings based on reviews
  for (const cleaner of cleaners) {
    const reviews = await prisma.review.findMany({
      where: { cleanerUserId: cleaner.id },
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await prisma.cleanerProfile.update({
        where: { userId: cleaner.id },
        data: {
          ratingAvg: avgRating,
          ratingCount: reviews.length,
        },
      });
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`Created:`);
  console.log(`- 1 Admin user`);
  console.log(`- ${clients.length} Client users`);
  console.log(`- ${cleaners.length} Cleaner users`);
  console.log(`- ${categories.length} Service categories`);
  console.log(`- ${services.length} Base services`);
  console.log(`- ${cleanerServices.length} Cleaner service offerings`);
  console.log(`- ${bookings.length} Sample bookings`);
  console.log(`- ${locations.length} Locations`);
  console.log(`- Multiple reviews, disputes, and transactions`);

  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@cleanmarketplace.com / password123');
  console.log('Client: client1@test.com / password123');
  console.log('Cleaner: cleaner1@test.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
