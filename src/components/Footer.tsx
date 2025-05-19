import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div
      className="py-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm mt-24"
      id="contact"
    >
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-24">
        {/* LEFT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link href="/">
            <div className="text-2xl font-bold tracking-wide">Teddy & Co</div>
          </Link>
          <p>172 Street, University Street, Ajman, UAE</p>
          <span className="font-semibold">support@teddyandco.co.uk</span>
          <span className="font-semibold">+971 508803183</span>
          <div className="flex gap-6">
            <Image src="/facebook.png" alt="Facebook" width={16} height={16} />
            <Image
              src="/instagram.png"
              alt="Instagram"
              width={16}
              height={16}
            />
            <Image src="/youtube.png" alt="YouTube" width={16} height={16} />
            <Image
              src="/pinterest.png"
              alt="Pinterest"
              width={16}
              height={16}
            />
            <Image src="/x.png" alt="X" width={16} height={16} />
          </div>
        </div>

        {/* CENTER */}
        <div className="hidden lg:flex justify-between w-1/2">
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">ABOUT</h1>
            <div className="flex flex-col gap-6">
              <Link href="#">Sustainability</Link>
              <Link href="#">Contact</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">SHOP</h1>
            <div className="flex flex-col gap-6">
              <Link href="#">Teddy Bears</Link>
              <Link href="#">Gifts</Link>
              <Link href="#">Collections</Link>
              <Link href="#">Best Sellers</Link>
              <Link href="#">Limited Editions</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">SUPPORT</h1>
            <div className="flex flex-col gap-6">
              <Link href="#">FAQs</Link>
              <Link href="#">Delivery</Link>
              <Link href="#">Returns</Link>
              <Link href="#">Terms & Conditions</Link>
              <Link href="#">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <h1 className="font-medium text-lg">JOIN OUR CLUB</h1>
          <p>
            Sign up to get snuggly updates, exclusive offers, and first access
            to new arrivals.
          </p>
          <div className="flex">
            <input type="text" placeholder="Your email" className="p-4 w-3/4" />
            <button className="w-1/4 bg-black text-white">JOIN</button>
          </div>
          <span className="font-semibold">We accept</span>
          <div className="flex justify-between">
            <Image src="/visa.png" alt="Visa" width={40} height={20} />
            <Image
              src="/mastercard.png"
              alt="Mastercard"
              width={40}
              height={20}
            />
            <Image src="/paypal.png" alt="PayPal" width={40} height={20} />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
        <div className="">© 2025 Teddy & Co. All rights reserved.</div>
        <div className="flex flex-col gap-8 md:flex-row">
          <div>
            <span className="text-gray-500 mr-4">Language</span>
            <span className="font-medium">United Kingdom | English</span>
          </div>
          <div>
            <span className="text-gray-500 mr-4">Currency</span>
            <span className="font-medium">AED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
