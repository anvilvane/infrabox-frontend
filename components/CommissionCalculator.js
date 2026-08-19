import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Calculator } from 'lucide-react';
import { Slider } from './ui/slider';

export default function CommissionCalculator() {
  const [customersReferred, setCustomersReferred] = useState(5);
  const [avgPlan, setAvgPlan] = useState('scale'); // growth, scale, enterprise
  const [avgMailboxes, setAvgMailboxes] = useState(500);
  
  // Commission rates (10% of revenue)
  const commissionRate = 0.10;
  
  const planPricing = {
    growth: {
      name: 'Growth Agency',
      basePrice: 997,
      includedMailboxes: 100,
      additionalMailboxPrice: 5
    },
    scale: {
      name: 'Scale Agency',
      basePrice: 2997,
      includedMailboxes: 500,
      additionalMailboxPrice: 4
    },
    enterprise: {
      name: 'Enterprise Agency',
      basePrice: 5000,
      includedMailboxes: 1000,
      additionalMailboxPrice: 3
    }
  };

  const calculateCommissions = () => {
    const plan = planPricing[avgPlan];
    let monthlyRevenuePerCustomer = plan.basePrice;
    
    // Calculate additional mailbox costs
    if (avgMailboxes > plan.includedMailboxes) {
      const additionalMailboxes = avgMailboxes - plan.includedMailboxes;
      monthlyRevenuePerCustomer += additionalMailboxes * plan.additionalMailboxPrice;
    }
    
    // Calculate commissions
    const monthlyCommissionPerCustomer = monthlyRevenuePerCustomer * commissionRate;
    const totalMonthlyCommission = monthlyCommissionPerCustomer * customersReferred;
    const annualCommission = totalMonthlyCommission * 12;
    const lifetimeValue = annualCommission * 2; // Assuming 2-year average customer lifetime
    
    return {
      monthlyPerCustomer: monthlyCommissionPerCustomer,
      totalMonthly: totalMonthlyCommission,
      totalAnnual: annualCommission,
      lifetimeValue: lifetimeValue,
      revenuePerCustomer: monthlyRevenuePerCustomer
    };
  };

  const result = calculateCommissions();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="border-gray-200 border-dashed bg-gray-50">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-16">
        
        {/* Section Header */}
        <div className="text-center text-balance mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <Calculator className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Calculate Your Earnings Potential
          </h2>
          <p className="text-base max-w-2xl mt-4 text-gray-600 mx-auto">
            See how much you could earn with the Infrabox affiliate program. Our average customer purchases 500+ mailboxes!
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            
            
            {/* Input Section */}
            <div className="p-8 border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Customers Referred */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Customers You Refer
                  </label>
                  <div className="relative">
                    <Slider
                      min={1}
                      max={50}
                      step={1}
                      value={[customersReferred]}
                      onValueChange={([val]) => setCustomersReferred(val)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1</span>
                      <span>25</span>
                      <span>50</span>
                    </div>
                    <div className="text-center mt-3">
                      <div className="text-3xl font-bold text-[#1240cc]">
                        {customersReferred}
                      </div>
                      <div className="text-xs text-gray-600">
                        customers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Plan */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Average Customer Plan
                  </label>
                  <div className="space-y-2">
                    {Object.entries(planPricing).map(([key, plan]) => (
                      <button
                        key={key}
                        onClick={() => setAvgPlan(key)}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          avgPlan === key
                            ? 'border-[#1240cc] bg-[#1240cc] text-white shadow-md scale-[1.02]'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md'
                        }`}
                      >
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-xs opacity-80">
                          ${plan.basePrice}/mo • {plan.includedMailboxes} mailboxes
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Average Mailboxes */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Avg Mailboxes Per Customer
                  </label>
                  <div className="relative">
                    <Slider
                      min={50}
                      max={5000}
                      step={50}
                      value={[avgMailboxes]}
                      onValueChange={([val]) => setAvgMailboxes(val)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>50</span>
                      <span>500</span>
                      <span>1000</span>
                      <span>5000</span>
                    </div>
                    <div className="text-center mt-3">
                      <div className="text-3xl font-bold text-[#1240cc]">
                        {avgMailboxes}
                      </div>
                      <div className="text-xs text-gray-600">
                        mailboxes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Monthly Per Customer */}
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <Users className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-[#1240cc] mb-1">
                    {formatCurrency(result.monthlyPerCustomer)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Per Customer/Month
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    10% of {formatCurrency(result.revenuePerCustomer)}
                  </div>
                </div>

                {/* Total Monthly */}
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border-2 border-emerald-200">
                  <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {formatCurrency(result.totalMonthly)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Monthly Earnings
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    Recurring Revenue
                  </div>
                </div>

                {/* Annual Earnings */}
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-[#1240cc] mb-1">
                    {formatCurrency(result.totalAnnual)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Annual Earnings
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    First Year Income
                  </div>
                </div>

                {/* Lifetime Value */}
                <div className="text-center p-6 bg-gradient-to-br from-emerald-600 to-green-600 text-white rounded-xl shadow-lg">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold">$</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {formatCurrency(result.lifetimeValue)}
                  </div>
                  <div className="text-sm opacity-90">
                    2-Year Value
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    Many customers stay longer!
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 text-center">
                <p className="text-gray-700 mb-4">
                  Ready to start earning <span className="font-bold text-emerald-600">{formatCurrency(result.totalMonthly)}</span> monthly?
                </p>
                <a 
                  href="https://partner.infrabox.software/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex transition-all text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] hover:scale-105 hover:shadow-xl focus:ring-[#1240cc] h-11 px-8 py-3 text-base shadow-lg shadow-[#1240cc]/25 gap-2 cursor-pointer font-semibold"
                >
                  Start Earning Now
                  <TrendingUp className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-900">No Earning Caps</div>
              <div className="text-xs text-gray-600 mt-1">Unlimited commission potential</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-900">Quarterly Payouts</div>
              <div className="text-xs text-gray-600 mt-1">Get paid every quarter via Stripe</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-900">Real-time Tracking</div>
              <div className="text-xs text-gray-600 mt-1">Monitor your earnings live</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}