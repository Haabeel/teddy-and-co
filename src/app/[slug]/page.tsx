import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
function removePTags(
  htmlString: string | null | undefined,
): string | null | undefined {
  if (!htmlString) return htmlString;
  /**
   * Removes opening <p> and closing </p> tags from an HTML string.
   *
   * This function uses a regular expression to find and remove:
   * - Opening <p> tags, potentially with attributes (e.g., <p class="foo">).
   * - Closing </p> tags.
   * The matching is case-insensitive.
   *
   * @param htmlString The input string containing HTML.
   * @returns The string with <p> and </p> tags removed.
   */

  // Regex explanation:
  // <       - Matches the opening angle bracket.
  // \s*     - Matches zero or more whitespace characters.
  // \/?     - Matches an optional forward slash (for closing tags like </p>).
  // \s*     - Matches zero or more whitespace characters.
  // p       - Matches the letter 'p'.
  // \b      - Matches a word boundary to ensure it's specifically a 'p' tag
  //           (e.g., doesn't match '<pending>').
  // [^>]*   - Matches any character that is NOT a closing angle bracket (>)
  //           zero or more times. This handles attributes within the opening tag.
  // >       - Matches the closing angle bracket.
  // The "gi" flags mean:
  // g - Global: Find all matches rather than stopping after the first.
  // i - Case-insensitive: Match <p>, <P>, </p>, </P>, etc.
  const pTagRegex = /<\s*\/?\s*p\b[^>]*>/gi;

  return htmlString.replace(pTagRegex, "");
}

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  const wixClient = await wixClientServer();
  const isLoggedIn = wixClient.auth.loggedIn();
  const products = await wixClient.products
    .queryProducts()
    .eq("slug", params.slug)
    .find();
  if (!products.items[0]) {
    return notFound();
  }

  const product = products.items[0];
  // const productDescription = product.`gcc`
  console.log("Product", product);
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.media?.items} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{removePTags(product.description)}</p>
        <div className="h-[2px] bg-gray-100" />
        {product.price?.price === product.price?.discountedPrice ? (
          <h2 className="font-medium text-2xl">AED{product.price?.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${product.price?.price}
            </h3>
            <h2 className="font-medium text-2xl">
              AED{product.price?.discountedPrice}
            </h2>
          </div>
        )}
        <div className="h-[2px] bg-gray-100" />
        {product.variants && product.productOptions ? (
          <CustomizeProducts
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : (
          <Add
            disabled={!isLoggedIn}
            productId={product._id!}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={product.stock?.quantity || 0}
          />
        )}
        <div className="h-[2px] bg-gray-100" />
        {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            <p>{section.description}</p>
          </div>
        ))}
        <div className="h-[2px] bg-gray-100" />
        {/* REVIEWS */}
        {/* <h1 className="text-2xl">User Reviews</h1> */}
        {/* <Suspense fallback="Loading..."> */}
        {/*   <Reviews productId={product._id!} /> */}
        {/* </Suspense> */}
      </div>
    </div>
  );
};

export default SinglePage;
