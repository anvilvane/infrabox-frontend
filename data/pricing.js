export const pricingData = {
  monthly: {
    professional: { 
      price: 39, 
      period: 'per month', 
      additionalMailbox: 3.5,
      includedMailboxes: 10,
      name: 'Professional'
    },
    agency: { 
      price: 99, 
      period: 'per month', 
      additionalMailbox: 3.25,
      includedMailboxes: 30,
      name: 'Agency'
    },
    enterprise: { 
      price: 299, 
      period: 'per month', 
      additionalMailbox: 2.99,
      includedMailboxes: 100,
      name: 'Enterprise'
    }
  },
  quarterly: {
    professional: { 
      price: 35, 
      period: 'per month', 
      additionalMailbox: 3.4,
      includedMailboxes: 10,
      name: 'Professional'
    },
    agency: { 
      price: 90, 
      period: 'per month', 
      additionalMailbox: 3,
      includedMailboxes: 30,
      name: 'Agency'
    },
    enterprise: { 
      price: 290, 
      period: 'per month', 
      additionalMailbox: 2.9,
      includedMailboxes: 100,
      name: 'Enterprise'
    }
  },
  annual: {
    professional: { 
      price: 31, 
      period: 'per month', 
      additionalMailbox: 3.1,
      includedMailboxes: 10,
      name: 'Professional'
    },
    agency: { 
      price: 81, 
      period: 'per month', 
      additionalMailbox: 2.7,
      includedMailboxes: 30,
      name: 'Agency'
    },
    enterprise: { 
      price: 250, 
      period: 'per month', 
      additionalMailbox: 2.5,
      includedMailboxes: 100,
      name: 'Enterprise'
    }
  }
};

export const planInfo = {
  professional: {
    name: 'Professional',
    description: 'Perfect for small teams getting started.',
    mailboxSlots: '10 Google mailbox slots',
    popular: false
  },
  agency: {
    name: 'Agency',
    description: 'Ideal for growing teams scaling their outreach.',
    mailboxSlots: '30 Google mailbox slots',
    popular: true
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Built for teams with high-volume campaigns.',
    mailboxSlots: '100 Google mailbox slots',
    popular: false
  }
};