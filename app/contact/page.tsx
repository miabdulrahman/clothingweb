import { getWhatsAppDisplayNumber, buildWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { FadeIn, SlideUp } from '@/components/motion/Transitions';

export const metadata = {
  title: 'Contact Support — Auren | AUREN',
  description: 'Reach out to our customer care team on WhatsApp, Instagram, or email. We assist with ordering, shipping, and sizing.',
};

export default function ContactPage() {
  const whatsappDisplay = getWhatsAppDisplayNumber();
  const whatsappUrl = buildWhatsAppInquiryUrl();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20 select-none">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold">
          Get in touch
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-brand-charcoal">
          Connect With Us
        </h1>
        <p className="text-sm text-brand-charcoal/50 font-light max-w-lg mx-auto leading-relaxed">
          Have questions about a specific size, fabric details, or custom order delivery? Choose your preferred channel to connect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-4xl mx-auto">
        {/* Contact Info Card */}
        <SlideUp className="border border-brand-charcoal/5 p-8 bg-brand-cream space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-brand-gold pb-2 border-b border-brand-charcoal/10">
              Direct Channels
            </h2>
            <div className="space-y-4 pt-2">
              {/* WhatsApp */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-brand-charcoal/40 tracking-wider">WhatsApp chat</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base font-bold text-brand-charcoal hover:text-brand-gold transition-colors tracking-wide"
                >
                  {whatsappDisplay}
                </a>
              </div>
              {/* Instagram */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-brand-charcoal/40 tracking-wider">Instagram direct message</span>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base font-bold text-brand-charcoal hover:text-brand-gold transition-colors tracking-wide"
                >
                  @auren.modest
                </a>
              </div>
              {/* Email */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-brand-charcoal/40 tracking-wider">Electronic mail</span>
                <a
                  href="mailto:support@auren.com"
                  className="block text-base font-bold text-brand-charcoal hover:text-brand-gold transition-colors tracking-wide"
                >
                  support@auren.com
                </a>
              </div>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-wider font-semibold text-brand-charcoal/50">
            Average response time: Within 1-2 hours
          </div>
        </SlideUp>

        {/* Coverage Card */}
        <SlideUp delay={0.2} className="border border-brand-charcoal/5 p-8 bg-brand-cream space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-brand-gold pb-2 border-b border-brand-charcoal/10">
              Delivery Coverage
            </h2>
            <p className="text-xs text-brand-charcoal/65 font-light leading-relaxed">
              We provide quick and tracked islandwide shipping across Sri Lanka, including Colombo, Kandy, Galle, Jaffna, and other suburban centers.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-brand-charcoal/80 font-light">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Colombo: 1-2 Business Days</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-brand-charcoal/80 font-light">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Other Districts: 2-5 Business Days</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-brand-charcoal/80 font-light">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Cash on Delivery (COD) and Bank Transfer</span>
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center py-3.5 bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90 transition-colors rounded-none font-semibold uppercase tracking-widest text-[10px]"
          >
            Inquire on WhatsApp
          </a>
        </SlideUp>
      </div>
    </div>
  );
}
