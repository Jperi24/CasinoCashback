import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "StakeBack - Get Up to 40% Casino Cashback in Crypto | Monthly Rewards",
  description = "Earn up to 40% monthly cashback on your casino play with StakeBack. Simple, transparent crypto rewards paid directly to your wallet. No fees, no hassle. Join now and start earning!",
  keywords = "casino cashback, crypto cashback, stake cashback, online casino rewards, casino bonuses, cryptocurrency casino, bitcoin casino cashback, monthly casino rewards, casino referral bonus, crypto gambling rewards, stake rewards, online gambling cashback",
  canonicalUrl = "https://stakeback.xyz/",
  ogType = "website",
  ogImage = "https://stakeback.xyz/og-image.png",
  twitterCard = "summary_large_image",
  noIndex = false,
  structuredData = null
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="StakeBack - Casino Cashback Platform" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

