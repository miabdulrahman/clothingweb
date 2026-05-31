'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  // Do not show on admin routes or product details page (which already has sticky WhatsApp bottom bar)
  const isProductDetailPath = pathname.startsWith('/product/');

  if (isAdminPath || isProductDetailPath) {
    return null;
  }

  const whatsappUrl = buildWhatsAppInquiryUrl();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
      className="fixed bottom-6 right-6 z-40 hidden sm:block"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20ba5a] hover:scale-105 transition-all duration-300 group relative"
        aria-label="Contact on WhatsApp"
      >
        {/* Tooltip */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-right bg-brand-charcoal text-brand-cream text-xs font-semibold py-2 px-3 shadow-md whitespace-nowrap rounded-none uppercase tracking-widest">
          Order on WhatsApp
        </span>

        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.497 1.45 5.416 1.451 5.458 0 9.897-4.437 9.902-9.899.002-2.646-1.02-5.133-2.88-6.996C17.228 1.856 14.743.834 12.09.833 6.63.833 2.19 5.27 2.185 10.733c-.001 1.927.501 3.811 1.457 5.418L2.73 22.179l6.082-1.593c1.558.85 3.325 1.298 5.12 1.299h.005zm10.72-7.516c-.292-.146-1.728-.853-1.996-.952-.266-.098-.46-.147-.654.146-.195.293-.755.952-.924 1.147-.17.195-.339.219-.63.073-.292-.147-1.233-.454-2.35-1.45-1.01-.898-1.532-1.109-1.824-1.255-.292-.147-.46-.073-.606.073-.146.147-.631.733-.797.92-.167.188-.334.219-.626.072-.29-.145-1.23-.453-2.345-1.448-.868-.774-1.455-1.73-1.625-2.022-.17-.293-.018-.452.129-.597.13-.13.292-.341.437-.512.146-.17.195-.293.293-.488.098-.195.048-.366-.024-.513-.073-.146-.654-1.579-.896-2.164-.236-.569-.475-.491-.654-.5l-.56-.008c-.193 0-.507.073-.773.366-.266.292-1.015.992-1.015 2.42 0 1.427 1.039 2.808 1.185 3.003.146.195 2.045 3.123 4.954 4.38.692.3 1.233.479 1.654.613.696.222 1.33.191 1.83.116.559-.083 1.729-.707 1.972-1.39.244-.683.244-1.268.17-1.39-.073-.122-.268-.195-.56-.341z" />
        </svg>
      </a>
    </motion.div>
  );
}
