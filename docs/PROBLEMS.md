# The problem bank

250 problems, grouped by the industry each is mainly about. Founders see the title, the problem and the challenge, and never the rarity, the evidence or the scores. Approve, edit or reject each one in `/team/bank` or in the Problems tab of the Sheet. Generated from `data/problems.json` by `pnpm bank:list`.

| Industry | Problems |
| --- | --- |
| Retail and local shops | 15 |
| Food and quick commerce | 21 |
| Money and finance | 24 |
| Health and fitness | 20 |
| Education and careers | 20 |
| Work and teams | 34 |
| Creators and media | 29 |
| Travel and mobility | 13 |
| Farming and food supply | 11 |
| Homes and real estate | 23 |
| Manufacturing and logistics | 24 |
| Fashion and beauty | 16 |

## Retail and local shops

### P009 · Tax notices built on UPI receipts

Small traders received thousands of tax notices based purely on their UPI receipts, then were asked for years of purchase bills and statements they never kept, and some pulled their QR codes to go cash-only. Their billing software does not help, because records vanish at year-end, calculations go wrong and they still pay an accountant to redo it.

**Challenge:** Turn a small shop's payment history into books that can answer a tax notice in a day.

Mythic · for businesses · India · teaches Data and dashboards, Automation and integrations, AI agents · also Money

<details><summary>Evidence (5) and scores (27)</summary>

- Cosmetics retailer lost thousands of rupees to repeated calculation errors in her GST billing app and got no compensation. [capterra, 2025-09-01](https://www.capterra.com/p/202732/FloBooks/reviews/#1)
- Micro-shops were asked for years of purchase bills and bank statements they never kept, after tax notices built purely on UPI receipts. [news, 2025-07-26](https://www.thenewsminute.com/karnataka/karnataka-how-a-vegetable-vendors-gst-notice-triggered-a-statewide-upi-boycott)
- Karnataka small traders got thousands of GST notices based on UPI receipts; confused about thresholds, many pulled QR codes and went cash-only. [news, 2025-07-22](https://www.theweek.in/news/biz-tech/2025/07/22/karnataka-upi-gst-issue-ruling-congress-bjp-play-the-blame-game-as-small-traders-protest-gst-notices.html)
- Billing app forces illogical mandatory fields and lacks proper accounting features, so shopkeepers still need an accountant's separate software. [capterra, 2025-02-13](https://www.capterra.com/p/180579/Vyapar/reviews/#4)
- Small shop owner's billing records vanished during year-end calculation; figures mismatched and support suggested re-entering everything manually. [capterra, 2025-01-23](https://www.capterra.com/p/180579/Vyapar/reviews/#1)

**Why now:** Tax authorities began matching UPI receipts to registrations in 2025, so payment history has become evidence micro-shops must now explain.

pain 5 · frequency 3 · willingness 4 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P021 · Seller cash stuck in COD and returns

Small online sellers in India see a quarter or more of cash-on-delivery orders returned and wait days for couriers to remit the rest, which chokes restocking. Selling on open networks adds payouts of one to two weeks and fees of 25 to 35 percent, so a profitable month on paper still runs out of cash.

**Challenge:** Show a small online seller which orders will actually turn into cash, and when, before they spend on stock or ads.

Epic · for creators · India · teaches Payments, Data and dashboards · also Money

<details><summary>Evidence (3) and scores (27)</summary>

- Local shops selling on ONDC lose 25-35% of earnings to delivery, packaging and fees, wait 7-15 days for payouts, and eat return costs. [news, 2026-06](https://www.rhinotechmedia.com/why-selling-on-ondc-is-still-not-easy-for-small-sellers-in-2026/)
- Indian fashion D2C founders underestimate RTO: up to 40% of COD orders bounce, eating 8-15% of revenue via shipping, damage and wasted ad spend. [other, 2026-05-19](https://www.hillteck.com/blog/rto-cost-indian-d2c-brands.html)
- Indian dropshippers and small online sellers see about a quarter of COD orders returned and wait 3-7 days for courier cash, choking restocking. [other, 2025-11-01](https://qikink.com/blog/cash-on-delivery-problems/)

**Why now:** COD still dominates in smaller Indian towns, and order exports from couriers make a cash forecast easy to build.

pain 5 · frequency 5 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P033 · Billing software that freezes at the busiest hour

Shop billing and ledger software freezes during rush hours, resets settings after updates and waits weeks for fixes, so invoices fail and shared bills arrive blank. Owners fall back to paper for small credit entries because logging them while serving the next customer is too slow, and paper notes get lost.

**Challenge:** Let a shopkeeper record a sale or a credit entry in under five seconds, even with no network.

Rare · for businesses · India · teaches Mobile apps, Voice AI · also Money

<details><summary>Evidence (6) and scores (26)</summary>

- Kirana owner can't log small customer credit fast while serving the next buyer; paper notes get lost and cloud apps feel unsafe for customer balances. [other, 2026-10-03](https://dev.to/arun2232/udhaar-a-private-voice-khata-for-a-kirana-shopkeeper-5431)
- Billing app freezes during busy hours, barcode label printing fails, and invoices shared over WhatsApp arrive as blank files to customers. [capterra, 2025-08-14](https://www.capterra.com/p/180579/Vyapar/reviews/#2)
- Pharmacy retailer says inventory-billing vendor dodges responsibility when problems arise, leaving the counter stuck mid-operation. [capterra, 2025-05-19](https://www.capterra.com/p/151832/Erp-Software-9/reviews/#3)
- Apparel shop's billing settings reset after every update and bugs take three to four months to fix, disrupting daily invoicing. [capterra, 2025-05-06](https://www.capterra.com/p/202732/FloBooks/reviews/#2)
- Digital ledger app lags at peak hours and switching phones is clunky, so shopkeepers fall back to paper khata for credit entries. [other, 2024-10-04](https://www.techjockey.com/reviews/khatabook#1)
- Stationery supplier waited over 15 days for billing app support, who blamed the shop's network instead of fixing the bug. [capterra, 2024-05-31](https://www.capterra.com/p/202732/FloBooks/reviews/#3)

**Why now:** Small on-device speech models now run offline on cheap Android phones, so a voice entry can work without a network.

pain 4 · frequency 5 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P045 · Kiranas closing in the shadow of dark stores

Two lakh kiranas closed in a year and most grocery stores near quick-commerce dark stores saw volumes fall, because they cannot match dark-store prices, range or delivery speed. A neighbourhood shop survives on a few hundred loyal households, so a handful of defections can close it.

**Challenge:** Help a kirana keep its loyal households ordering from it rather than a ten-minute delivery service.

Epic · for businesses · India · teaches Full-stack web, AI agents · also Food

<details><summary>Evidence (4) and scores (26)</summary>

- A neighbourhood shop needs hundreds of loyal households just to survive on thin margins, so a few defections to online can close it. [hn, 2026-05-26](https://news.ycombinator.com/item?id=48281004)
- Retailer federation says two lakh kiranas closed in a year; 60% of Mumbai grocery stores saw sales volumes fall near quick-commerce dark stores. [news, 2025-12-10](https://www.socialnews.xyz/2025/12/10/rapid-rise-of-quick-commerce-hampering-kirana-shops-income-industry-body/amp/)
- Dollar-store chains undercut and wipe out independent local grocers and hardware shops in small towns, leaving residents fewer real options. [hn, 2025-12-08](https://news.ycombinator.com/item?id=46192069)
- Kiranas buying via distributors can't match dark-store prices, stock only 1,000-1,500 items, and lack experience fulfilling online orders reliably. [other, 2025-03-11](https://techgeography.substack.com/p/kiranapro-challenging-quick-commerce)

**Why now:** Quick commerce expanded into most Indian cities in 2025, and chat ordering agents now cost very little to run.

pain 5 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P057 · Fake cash-on-delivery orders bleeding small sellers

Small online sellers lose around ₹600 on every fake or refused cash-on-delivery order once shipping and ad spend are counted, and competitors place bomb orders on purpose. The verification add-ons meant to catch them break for days, while scammers send unordered cash-on-delivery parcels to leaked addresses under real stores' names.

**Challenge:** Stop fake cash-on-delivery orders before they ship, without turning away real first-time buyers.

Rare · for creators · India · teaches Voice AI, Automation and integrations, Payments · also Fashion

<details><summary>Evidence (3) and scores (26)</summary>

- Shopper received an unordered ₹500 COD parcel attributed to an Instagram store, containing half a soap bar; scammers exploit leaked addresses. [news, 2026-08-04](https://www.india.com/viral/bengaluru-woman-exposes-cash-on-delivery-scam-in-viral-instagram-claim-says-didnt-order-this-8493231/amp/)
- Small Indian cosmetics seller faces 25-40% COD return rates, competitor 'bomb' fake orders and ₹600 losses per failed delivery including ad spend. [other, 2026-05-30](https://kallosvanity.com/blogs/news/the-dark-side-of-cod-what-every-indian-seller-needs-to-know)
- Indian online store's COD order-verification tool broke for over ten days with unhelpful support, letting fake orders slip through. [other, 2025-04-24](https://apps.shopify.com/cod-order-confirmation-1/reviews)

**Why now:** Voice agents can now call every COD buyer to confirm in their language for a few rupees.

pain 4 · frequency 5 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P069 · Business data held hostage by software vendors

Small firms depend on vendors and implementation partners for their own records: one partner deleted a company's database without permission, vendors break upgrade promises and change renewal terms at will, and some families keep decades-old programs alive in emulators because moving the data feels impossible. Leaving costs as much as staying.

**Challenge:** Get a small business's records out of any old system into a format it owns, in an afternoon.

Legendary · for businesses · global · teaches Data and dashboards, Automation and integrations · also Work

<details><summary>Evidence (3) and scores (25)</summary>

- Relatives keep 1980s business programs alive through emulators because moving the data elsewhere feels impossible. [hn, 2025-11-05](https://news.ycombinator.com/item?id=45824428)
- Implementation partner deleted a company's Odoo database without authorisation, exposing small firms' dependence on partners for their data. [capterra, 2025-11](https://www.capterra.com/p/135618/Odoo/reviews/#3)
- Shop billing ERP vendor broke upgrade promises and changes renewal policy at will to extract more money, with no after-sales support. [capterra, 2025-04-11](https://www.capterra.com/p/151832/Erp-Software-9/reviews/#2)

**Why now:** Models can now infer the structure of old files and map them to a modern schema, which used to need a consultant.

pain 4 · frequency 2 · willingness 3 · buildability 4 · learning 4 · novelty 4 · openness 4

</details>

### P081 · Distributor vans serving fifty shops instead of eighty

Consumer-goods distributors are losing 10 to 25 percent of volume to quick commerce, so their vans now serve far fewer kiranas while fixed costs stay the same. Struggling retailers then delay payment, stretching 30 to 60 day credit further, and the distributor's cash is squeezed from both sides.

**Challenge:** Help a distributor win back revenue per route, or cut the cost of serving each shop, by a fifth.

Legendary · for businesses · India · teaches Data and dashboards, Mobile apps · also Manufacturing

<details><summary>Evidence (3) and scores (25)</summary>

- FMCG distributor vans now serve 50 kiranas instead of 80 while costs stay fixed; struggling retailers delay payments, stretching 30-60 day credit further. [other, 2026-04-27](https://kotakinsights.substack.com/p/fmcg-distributor-disruption-quick-commerce)
- Metro distributors lose 10-25% of snack and beverage volume to quick commerce; per-stop kirana revenue drops 15-30% as high-margin SKUs migrate. [other, 2026-04-25](https://spirestock.com/blog/blinkit-zepto-impact-fmcg-distribution)
- Consumer-goods distributors complain quick-commerce deep discounting below their landed cost is draining kirana orders they've served for decades. [news, 2025-03-06](https://www.businesstoday.in/latest/corporate/story/quick-commerce-all-india-consumer-products-distributors-federation-knocks-on-cci-door-467018-2025-03-06)

**Why now:** Quick commerce's growth in 2025 shifted high-margin products away from kirana routes, and distributors are looking for ways to cut cost per stop.

pain 4 · frequency 4 · willingness 4 · buildability 3 · learning 3 · novelty 4 · openness 3

</details>

### P093 · Reordering hundreds of items by gut feel

Kirana owners reorder hundreds of items by memory, running out of fast sellers while slow stock ties up cash, and they stock what distributors push rather than what customers ask for. For a small shop that must turn its stock several times a year to cover fixed costs, slow shelves quietly sink it.

**Challenge:** Make the weekly reorder take ten minutes and leave fewer empty shelves and fewer dusty ones.

Rare · for businesses · India · teaches Data and dashboards, AI agents

<details><summary>Evidence (3) and scores (25)</summary>

- Kirana stores reorder hundreds of items by gut feel, running out of fast sellers and overstocking slow ones. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#WMxoOBcVf)
- Independent bookshop must turn limited inventory four to five times a year just to cover fixed costs, so slow stock quietly sinks it. [hn, 2025-09-28](https://news.ycombinator.com/item?id=45401674)
- Shoppers at neighbourhood kiranas often settle for second-best or come back tomorrow, since owners stock what distributors push, not newer healthier items customers ask for. [other, 2024-12-06](https://harshitrakheja.substack.com/p/kirana-stores-may-be-closing-down)

**Why now:** Billing data now exists in many kiranas, and simple forecasting can run cheaply on it.

pain 4 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P105 · Card fees and add-ons eating a shop's margin

Small retailers pay flat processing fees plus a monthly charge for nearly every point-of-sale feature, and surprise invoices for using an outside card processor. One shop spends about $400 a month on card fees, chargebacks go through without goods returned, and basic stock valuation reports cost extra.

**Challenge:** Show a small retailer exactly what payments and software cost per sale, and how to cut it.

Rare · for businesses · global · teaches Payments, Data and dashboards · also Money

<details><summary>Evidence (5) and scores (24)</summary>

- Small shop owner pays about $400 a month in card processing fees, eating margin that cash sales would have kept. [hn, 2026-09-09](https://news.ycombinator.com/item?id=49634703)
- Small retailer's flat processing fees plus monthly add-ons for essential POS tools eat thin margins, and support is only automated phone lines. [capterra, 2026-08-17](https://www.capterra.com/p/170272/Square-for-Retail/reviews/#2)
- Retailers say their POS lets debit-card chargebacks go through without merchandise returned, and charges extra for basic inventory valuation reports. [other, 2026-04-30](https://koronapos.com/blog/lightspeed-pos-review/)
- Shop owner hit with surprise $930 invoice for not using the POS vendor's own card processing, after sales promises said otherwise. [capterra, 2025-09-28](https://www.capterra.com/p/120491/Lightspeed-Retail/reviews/#1)
- Small business owner finds an extra fee attached to almost every POS feature, steadily shrinking profit on each sale. [capterra, 2025-07-17](https://www.capterra.com/p/275802/Square-Point-of-Sale/reviews/?page=3#3)

**Why now:** Processors keep adding feature fees in 2025 and 2026, and statements can now be parsed by models without custom integrations.

pain 4 · frequency 5 · willingness 3 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P117 · One flag and a seller's balance is gone

Small online sellers depend on a handful of marketplaces and payment providers that can close an account overnight and freeze its balance for months, sometimes after one unusually large sale. Honest market vendors have lost their main way to get paid because a provider banned every customer of one fraudulent stall.

**Challenge:** Keep a small seller trading and paid on the day one marketplace or payment provider freezes them.

Legendary · for creators · global · teaches Payments, Automation and integrations · also Money, Creators

<details><summary>Evidence (4) and scores (24)</summary>

- A marketplace seller was banned and had tens of thousands in balance frozen with no way to recover it. [hn, 2026-01-21](https://news.ycombinator.com/item?id=46710262)
- Online sellers depend on a few marketplaces that can close accounts overnight and wipe out the business. [hn, 2026-01-21](https://news.ycombinator.com/item?id=46710431)
- After one unusually large sale, a retailer's payment account was closed and funds frozen for 90 days despite no fraud history, crushing cash flow. [capterra, 2025-11-10](https://www.capterra.com/p/170272/Square-for-Retail/reviews/#1)
- Rural market sellers lost their main payment method when a P2P app banned every customer of one fraudulent vendor, freezing honest stalls' sales. [hn, 2025-06-18](https://news.ycombinator.com/item?id=44312551)

**Why now:** Automated risk systems at payment providers have grown stricter, and sellers increasingly run several channels they could fail over between.

pain 5 · frequency 2 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 4

</details>

### P129 · Ordering blind from suppliers you cannot see

Shop owners cannot see what their suppliers have in stock, so they over-order and block cash or run out, and supplier websites are too poorly searchable to help. Buying direct from brands is out of reach at small order sizes, and quality disputes on wholesale purchases are often rejected.

**Challenge:** Let a shopkeeper place a supplier order by voice note and know what will arrive, at what price, before paying.

Epic · for businesses · India · teaches Voice AI, Full-stack web · also Manufacturing

<details><summary>Evidence (4) and scores (24)</summary>

- Shop owners cannot see what their suppliers have in stock, so they either over-order and block cash or run out. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#hD5arr8tH)
- Small shopkeepers lose a large share of margin to distributors because they cannot buy directly from brands at workable order sizes. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#NpVxN24zL)
- A small business that buys from one main supplier struggles with that supplier's useless website search. [hn, 2026-01-13](https://news.ycombinator.com/item?id=46596534)
- Retailer buying wholesale rice on a B2B app received poor-quality stock and had the return rejected, blamed on an alleged return history. [other, 2024-08-24](https://www.consumercomplaints.in/bycompany/udaan-a513872.html)

**Why now:** Voice notes are already how many shopkeepers order, and speech models can now turn them into structured orders.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P141 · Stock counts that never match the shelf

Retailers on identical software see stock discrepancies that vary wildly by store, because staff count carelessly and inventory modules produce errors. Small shop owners have stopped reporting shoplifting at all, so losses go unrecorded and nobody knows what disappeared.

**Challenge:** Make a full stock count take an hour and be right, so a shop knows exactly what went missing.

Epic · for businesses · global · teaches Vision, Data and dashboards

<details><summary>Evidence (3) and scores (24)</summary>

- Small store owners have stopped reporting shoplifting because police never respond, so losses go unrecorded and uncompensated. [hn, 2025-09-22](https://news.ycombinator.com/item?id=45337008)
- Multi-location retailer found stock discrepancies varied wildly by store despite identical software; shrink comes from sloppy staff counting, not tools. [hn, 2025-04-14](https://news.ycombinator.com/item?id=43682233)
- Retailer's inventory module produces errors and support staff keep changing, so each ticket starts from scratch. [capterra, 2024-12-23](https://www.capterra.com/p/120491/Lightspeed-Retail/reviews/#3)

**Why now:** Phone cameras and vision models can now count items on a shelf, removing the manual step where errors come from.

pain 3 · frequency 4 · willingness 3 · buildability 3 · learning 5 · novelty 3 · openness 3

</details>

### P152 · Packaging costs and rules that shut out tiny sellers

Micro online sellers face thousands of euros a year in packaging registration and compliance fees before a first sale in Europe, and some tiny shops have stopped shipping there. At home, packaging component costs spiked 60 to 70 percent within weeks for small beauty brands, while customers complain about oversized boxes stuffed with plastic.

**Challenge:** Cut a small seller's packaging cost and paperwork per order, at home and abroad, by a third.

Legendary · for creators · global · teaches Full-stack web, Automation and integrations · also Fashion

<details><summary>Evidence (4) and scores (24)</summary>

- Micro online sellers face thousands of euros a year in packaging registration costs before making their first EU sale. [hn, 2026-08-29](https://news.ycombinator.com/item?id=49486044)
- Tiny repair-and-resale shop stopped shipping to EU customers because packaging-waste compliance fees outweigh its small cross-border sales. [hn, 2026-08-20](https://news.ycombinator.com/item?id=49374029)
- Indian beauty D2C brands saw 60-70% spikes in packaging component costs within weeks, squeezing thin margins before prices could be raised. [news, 2026-03-24](https://inc42.com/features/boxed-in-the-war-shock-for-d2c/)
- Single small items ordered online arrive in oversized boxes stuffed with plastic padding, frustrating eco-minded customers. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#P7jxwNUhb)

**Why now:** EU packaging rules tightened in 2025, and Indian packaging costs spiked in 2026.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P162 · Onboarded to the open network, then no orders

Most shops onboarded to India's open commerce network never transact meaningfully once buyer discounts end. Sellers juggle separate services for discovery, fulfilment, delivery and payment, and inconsistent logistics partners turn the few orders they get into failures.

**Challenge:** Get a small shop its first ten repeat online orders without paying for discounts.

Epic · for businesses · India · teaches AI agents, Automation and integrations

<details><summary>Evidence (3) and scores (23)</summary>

- About 85% of shops onboarded to ONDC never transact meaningfully; grocery and fashion sellers get almost no organic orders once buyer subsidies stop. [other, 2026-04-01](https://anitva.me/2026/04/01/the-ondc-reckoning-inside-indias-open-commerce-crossroads/)
- Small sellers on open networks juggle separate apps for discovery, fulfilment, delivery and payment, with inconsistent logistics partners causing order failures. [news, 2025-12-08](https://deccanfounders.com/2025/08/editor_picks/ondc-india-2025-digital-commerce-network-upi-style-open-network-mobility-on-ondc-indian-e-commerce-disruption-dpiit-ondc-initiative/)
- ONDC retail orders fell about 35% from peak once discounts ended, leaving small shops that onboarded with little sustained online demand. [news, 2025-05-05](https://www.business-standard.com/companies/news/ondc-ecommerce-failure-struggles-india-125050501101_1.html)

**Why now:** Order volumes on the open network fell once subsidies ended in 2025, leaving many onboarded shops looking for a reason to stay.

pain 3 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P172 · Re-entering the whole catalogue every time the till dies

Small merchants keep churning point-of-sale vendors as subsidised terminals break, prices climb, startups fold or the system cannot keep up with online sales. Every switch means re-entering the catalogue, retraining staff and running two systems in parallel, while staff key card numbers by hand.

**Challenge:** Move a shop from one billing system to another in an hour, catalogue, prices and history intact.

Epic · for businesses · global · teaches Automation and integrations, Full-stack web · also Work

<details><summary>Evidence (4) and scores (22)</summary>

- Small merchants keep churning POS vendors as subsidised hardware breaks or startups fold, re-entering catalogues and retraining staff each time. [hn, 2026-02-27](https://news.ycombinator.com/item?id=47181062)
- Growing multi-channel shop outgrew its POS: slow online sync and sluggish large catalogues forced costly migrations across three systems. [hn, 2026-02-27](https://news.ycombinator.com/item?id=47181286)
- Store's POS card terminal stopped working, forcing staff to key card numbers manually while subscription price rose $40 a month. [capterra, 2025-10-22](https://www.capterra.com/p/120491/Lightspeed-Retail/reviews/#2)
- Cosmetics retailer switched POS because prices kept climbing while it still wouldn't integrate with their other systems. [capterra, 2025-06-05](https://www.capterra.com/p/275802/Square-Point-of-Sale/reviews/?page=3#2)

**Why now:** Point-of-sale startups keep folding and repricing, and models can now map one vendor's export to another's import automatically.

pain 3 · frequency 2 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

## Food and quick commerce

### P001 · Delivery payouts that quietly lose lakhs

Restaurants find unapproved ad campaigns, silently widened discounts and programmes they never joined deducted from their delivery payouts, sometimes taking a month's settlement to zero. Payout statements layer commissions, fees and taxes so densely that owners cannot tell what each order earned, and one six-outlet chain lost ₹16 lakh before hiring a recovery service.

**Challenge:** Catch every wrong deduction on a restaurant's delivery payout the week it happens, with the evidence to claim it back.

Legendary · for businesses · India · teaches AI agents, Data and dashboards, Automation and integrations · also Money

<details><summary>Evidence (6) and scores (31)</summary>

- Restaurant owner can't make sense of layered payment-mechanism, convenience and GST deductions on each payout statement, even when customers already paid convenience fees. [news, 2026-04-18](https://www.postoast.com/restaurant-owners-complaint-over-payment-mechanism-convenience-fee-deductions)
- Restaurant owners say aggregator ad campaigns kept running or auto-reactivated despite refusals, draining lakhs from payouts, sometimes reducing monthly settlements to zero. [news, 2026-04-07](https://www.medianama.com/2026/04/223-swiggy-ad-charges-without-consent-unauthorized-deductions-restaurants/#1)
- A six-outlet chain lost Rs 16 lakh in small unnotified payout deductions and had to hire a third-party recovery service to reclaim most of it. [news, 2026-04-07](https://www.medianama.com/2026/04/223-swiggy-ad-charges-without-consent-unauthorized-deductions-restaurants/#2)
- Delivery app commissions can eat up to 60% of a dish's price, and many restaurant owners never work out how much they lose per order. [hn, 2025-10-17](https://news.ycombinator.com/item?id=45612354)
- A restaurant's limited two-hour discount on three dishes was silently expanded by the aggregator into an all-day, full-menu offer funded by the restaurant. [news, 2025-06-26](https://outlookbusiness.com/amp/story/start-up/news/restaurants-allege-zomato-swiggy-charge-them-for-ads-discounts-without-consent#1)
- Restaurants were enrolled in aggregator student-discount and trial-ad programmes they never approved, with revenue share creeping from 15% to 33%. [news, 2025-06-26](https://outlookbusiness.com/amp/story/start-up/news/restaurants-allege-zomato-swiggy-charge-them-for-ads-discounts-without-consent#2)

**Why now:** Aggregator commission and ad disputes made national news in 2025 and 2026, and agents can now read payout statements and match them to orders.

pain 5 · frequency 4 · willingness 5 · buildability 4 · learning 5 · novelty 4 · openness 4

</details>

### P013 · Weeks of chasing a chatbot for your own money

Refunds for cancelled or undelivered food orders take weeks, and chatbots block every route to a human, so customers chase support and threaten public escalation to get their money back. Those who cannot argue in English are denied outright, and restaurants owed money by the same services wait weeks through repeated escalations too.

**Challenge:** Get people their refund from a delivery service without them writing a single complaint themselves.

Epic · for consumers · India · teaches AI agents, Voice AI, Automation and integrations · also Money

<details><summary>Evidence (5) and scores (26)</summary>

- Customer promised compensation coupon for a damaged order never received it, and the chatbot blocked every route to a human agent. [other, 2026-10-02](https://www.trustpilot.com/review/zomato.com#2)
- Undelivered quick-commerce order still not refunded a month later; customer chasing support with no resolution timeline. [other, 2026-09-29](https://www.consumercomplaints.in/bycompany/blinkit-a616132.html#2)
- Non-English-speaking diners say AI-only support fails them, and refunds are denied when they can't argue their case in English. [other, 2026-08-14](https://www.trustpilot.com/review/www.zomato.com?page=3#4)
- Refunds for cancelled food orders take one to two weeks, with customers repeatedly chasing support and threatening public escalation. [other, 2026-06-01](https://zomato.pissedconsumer.com/#2)
- When aggregators wrongly deduct money, restaurants wait weeks for reimbursement; one outlet chased a Rs 2 lakh refund through repeated escalations. [news, 2025-06-26](https://outlookbusiness.com/amp/story/start-up/news/restaurants-allege-zomato-swiggy-charge-them-for-ads-discounts-without-consent#3)

**Why now:** Delivery services moved support to chatbots in 2025, and agents that write and follow up complaints in any language are now cheap to run.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 4

</details>

### P025 · Losing a food licence over missing paperwork

Small food manufacturers and farms keep hygiene, pest-control and field records on paper or in clumsy software, and a single inspection can find them missing. One manufacturer lost its licence after inspectors found pests and no food-safety records, while farmers report that record software cannot produce the compliance reports they are asked for.

**Challenge:** Make a small food unit inspection-ready every day with five minutes of record keeping.

Legendary · for businesses · global · teaches Mobile apps, Vision, Automation and integrations · also Farming

<details><summary>Evidence (3) and scores (25)</summary>

- Food manufacturer lost its licence after inspectors found pests and missing food-safety records, showing small units lack routine hygiene and documentation systems. [news, 2026-09-17](https://www.businesstoday.in/india/story/dead-rodents-cockroaches-found-at-food-unit-fssai-orders-immediate-shutdown-over-safety-risks-556142-2026-09-17)
- Food processing coordinator reports glitchy farm software and too many sections to learn, slowing daily record keeping. [capterra, 2025-09-24](https://www.capterra.com/p/136765/Farmbrite/reviews/#4)
- Farmer finds field records software too thin for nitrate-zone compliance reports, and two-step note saving risks losing entries. [capterra, 2025-07-31](https://www.capterra.com/p/163565/fieldmargin/reviews/#1)

**Why now:** Food-safety inspection drives intensified in Indian cities in 2025 and 2026, and phones can capture checklists with photos and timestamps.

pain 4 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P037 · Food bloggers paid in free meals

Micro food bloggers are often paid only in free meals, with no standard rates or defined deliverables, so their income is unpredictable. Restaurants and small food brands cannot spot inflated follower counts or tell whether a reel or an ad brought in paying customers, so they will not pay real money for it.

**Challenge:** Let a small food creator prove what their last reel sold, and get paid for it.

Legendary · for creators · India · teaches Data and dashboards, Payments, Full-stack web · also Creators

<details><summary>Evidence (3) and scores (25)</summary>

- Micro food bloggers in India are often paid only in free meals, with no standard rates or defined deliverables, making creator income unpredictable. [other, 2026-07](https://www.dinecard.in/blog/restaurant-food-blogger-influencer-collaboration-deal-india#1)
- Restaurants hosting food influencers can't spot inflated follower counts or measure whether a reel actually brought paying diners in. [other, 2026-07](https://www.dinecard.in/blog/restaurant-food-blogger-influencer-collaboration-deal-india#2)
- Small brands cannot tell whether quick-commerce order spikes come from paid ads or organic demand, so they cannot judge ad spend returning barely 1.2-1.5x. [news, 2025-07-15](https://www.storyboard18.com/brand-marketing/quick-commerces-ad-fee-toll-are-platforms-squeezing-out-small-d2c-brands-73952.htm#2)

**Why now:** Short-video food content exploded across Indian cities by 2025, and UPI and QR links make per-creator attribution cheap.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P049 · One viral reel and the home bakery breaks

Home chefs struggle with reliable delivery, spill-proof packaging and steady quality, and a single viral post can flood a small food seller with more orders than its stock and hands can manage. Customised celebration cakes arrive hours late or damaged, ruining birthdays, and the seller's reputation takes the hit.

**Challenge:** Help a home food seller say yes to the right number of orders and deliver every one intact.

Legendary · for creators · India · teaches Automation and integrations, Mobile apps, AI agents · also Travel

<details><summary>Evidence (3) and scores (25)</summary>

- Customised celebration cakes ordered online arrive hours late or damaged, ruining birthdays, and support demands video proof instead of fixing it. [other, 2026-08-21](https://se.trustpilot.com/review/bakingo.com#1)
- A viral social post can flood a small food vendor with demand it can't supply, straining stock, staff and quality overnight. [hn, 2026-08-15](https://news.ycombinator.com/item?id=49308841)
- Indian home chefs juggling household duties struggle with reliable delivery, spill-proof packaging and keeping quality steady as orders grow. [other, 2025-06-14](https://www.tiffit.com/blogs/the-rise-of-home-chefs-business-models-challenges-and-success-tips)

**Why now:** Reels drive sudden demand to home food sellers in 2025 and 2026, and hyperlocal two-wheeler delivery is available in most cities.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P061 · Card money that never reaches the restaurant

Restaurants run on same-day cash for suppliers and wages, yet card settlements arrive late, and after a change of bank details some stop arriving at all while support cannot trace them. Refunds owed by vendors after a cancelled contract can vanish the same way, squeezing working capital in a business with thin margins.

**Challenge:** Tell a restaurant owner every morning which payments are due, which are late, and who to chase.

Epic · for businesses · global · teaches Payments, Data and dashboards, Automation and integrations · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- Restaurant locked into a POS contract after misleading sales promises about installation; refund after cancellation never arrived. [capterra, 2026-06-25](https://www.capterra.com/p/136301/Toast-POS/reviews/#2)
- Delayed payment settlements hurt restaurants that run on same-day cash for suppliers and wages, squeezing working capital. [hn, 2025-10-17](https://news.ycombinator.com/item?id=45612333)
- Restaurant switched its bank details in its POS and then received no card settlements at all, with support unable to trace the missing money. [capterra, 2025-03-17](https://www.capterra.com/p/136301/Toast-POS/reviews/#1)

**Why now:** Restaurants now take money through cards, UPI, aggregators and wallets at once, so no single view shows what is outstanding.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P073 · Every rupee of the menu price already spoken for

Owner-run restaurants are squeezed by rising ingredient, labour and rent costs, taxes, card fees and aggregator commissions all at once. Most owners cannot see which of these is eating their margin, so they raise prices or add surcharges that drive diners away.

**Challenge:** Show a restaurant owner, dish by dish, where the money goes and which change would save the most.

Rare · for businesses · global · teaches Data and dashboards, AI agents, Full-stack web · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- Indian restaurateurs faced rising ingredient, labour and rent costs plus aggregator commissions in 2025, pushing them toward direct ordering and owning customer data. [news, 2025-12-26](https://www.restaurantindia.in/article/restaurant-industry-in-2025-a-year-of-reset-and-what-to-expect-in-2026.14828)
- Card processing fees on thin restaurant margins force owners to raise menu prices or add surcharges that irritate diners. [hn, 2025-05-12](https://news.ycombinator.com/item?id=43959187)
- Owner-run restaurants buckle under taxes and costs while chains and fast-food stands survive. [hn, 2025-04-06](https://news.ycombinator.com/item?id=43600033)

**Why now:** Restaurant costs rose sharply in 2025, and models can now read invoices and POS exports to cost each dish automatically.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P085 · Small buyers pay retail because they cannot buy wholesale

Small restaurants and large joint families both pay retail prices for staples, because suppliers only discount for committed, prepaid volumes and grocery services sell only retail packs. For owner-run kitchens where ingredients, wages and rent consume nearly the whole menu price, that premium is the difference between profit and loss.

**Challenge:** Let small kitchens and big households buy together at wholesale prices without storing a truckload.

Epic · for businesses · global · teaches Payments, Full-stack web, Automation and integrations · also Retail

<details><summary>Evidence (3) and scores (24)</summary>

- Small restaurants pay more to suppliers because their ordering is unpredictable; vendors only discount for committed, prepaid volumes they cannot manage. [hn, 2026-06-28](https://news.ycombinator.com/item?id=48708350)
- Large joint families buying staples in bulk still pay consumer prices because grocery apps only sell retail packs. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#DQh80xFtm)
- Independent restaurant owners work 14-hour shifts yet keep almost nothing, as ingredients, wages and rent consume nearly the whole menu price. [hn, 2025-08-13](https://news.ycombinator.com/item?id=44895315)

**Why now:** Group buying with UPI collection is trivial now, and food inflation in 2025 made the retail premium hurt more.

pain 3 · frequency 4 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P097 · Restaurants that do not know who their customers are

Delivery services mask customer details, so restaurants cannot build any direct relationship with the people who order from them, and fear their own order data will be used against them. Small owners lack the time to keep a website or online menu current, so they lean on social media and stay dependent on the aggregator for every repeat order.

**Challenge:** Help a small restaurant turn one-time delivery customers into regulars who order direct.

Rare · for businesses · India · teaches Full-stack web, Payments, Mobile apps · also Creators

<details><summary>Evidence (3) and scores (24)</summary>

- Small restaurant owners lack time and skills to keep a website or online menu current, so they rely on social media and lose discoverability. [hn, 2026-09-12](https://news.ycombinator.com/item?id=49677641)
- Restaurants complain aggregators mask customer data so they cannot build direct relationships; consumers simultaneously fear their phone numbers being shared with outlets. [news, 2025-11-20](https://www.businesstoday.in/amp/industry/story/privacy-risk-hope-govt-stops-this-zomato-swiggy-face-backlash-over-data-sharing-plan-502981-2025-11-20)
- Indian restaurants fear aggregators launching own quick-food apps will use their order data to compete against the very partners paying them commission. [news, 2025-01-10](https://www.businesstoday.in/technology/news/story/nrai-accuses-swiggy-zomato-of-abuse-of-power-over-private-label-food-apps-460277-2025-01-10)

**Why now:** Aggregators launched their own food brands in 2025, and restaurants are actively trying to own their customer data.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P109 · Six fees on one receipt

Food and grocery orders stack delivery, handling, packaging, service and surge fees on top of the food, and new taxes on delivery fees are passed straight to customers. The same meal can cost nearly double through a delivery service compared with the restaurant's own site, riders sometimes demand extra cash on top, and few buyers can judge the real price before checkout.

**Challenge:** Show a hungry customer the true total for the same order across every way of buying it, before they pay.

Epic · for consumers · India · teaches Full-stack web, Data and dashboards, AI agents · also Money

<details><summary>Evidence (5) and scores (24)</summary>

- Delivery rider demanded extra cash on top of app-paid delivery charges, and support sided with the rider. [other, 2026-10-01](https://www.trustpilot.com/review/swiggy.com#3)
- A single delivery receipt stacked six separate fees on top of food cost, making the real price impossible to judge before checkout. [hn, 2026-09-24](https://news.ycombinator.com/item?id=49827759)
- Same meal cost nearly double through a delivery app versus ordering on the restaurant's own site; diners rarely realise the gap. [hn, 2026-01-10](https://news.ycombinator.com/item?id=46566668)
- Quick-commerce shoppers lured by discounts find handling and protection fees added at checkout, and GST cuts often not passed on. [news, 2025-10-13](https://www.theweek.in/news/biz-tech/2025/10/13/quick-commerce-is-booming-this-shopping-season-but-why-is-the-government-not-happy.html#1)
- Food delivery platforms plan to pass new GST on delivery fees to customers and riders, after raising platform fees several times within weeks. [news, 2025-09-05](https://www.businesstoday.in/latest/corporate/story/zomato-swiggy-gst-delivery-fees-impact-492733-2025-09-05)

**Why now:** Delivery services raised fees several times in 2025 and GST on delivery fees followed, so the gap with ordering direct widened.

pain 3 · frequency 5 · willingness 2 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P121 · Infested kitchens behind five-star delivery listings

City inspection drives keep finding infestations, expired stock and poor handler hygiene in most restaurants checked, and insects turn up in sealed packets from dark stores. Diners ordering online have no way to see a kitchen's hygiene before they pay.

**Challenge:** Let a diner see how clean a kitchen is before ordering, in a way the kitchen cannot fake.

Legendary · for consumers · India · teaches Vision, Data and dashboards, Full-stack web · also Health

<details><summary>Evidence (3) and scores (24)</summary>

- Hyderabad inspection drive found infestations, expired stock and poor handler hygiene in most restaurants checked; diners have no way to see kitchen hygiene before ordering. [news, 2026-09-25](https://newsmeter.in/hyderabad/cockroaches-to-expired-food-tg-safe-inspects-15-establishments-suspends-fssai-licences-of-8-776170)
- Live insects found inside a sealed instant noodle packet bought via quick commerce, raising dark-store storage hygiene concerns. [other, 2026-09-11](https://www.trustpilot.com/review/www.zepto.com#3)
- Food delivery customers cannot see whether a restaurant kitchen meets hygiene and safety standards. [fixmyitch, 2026-01](https://razorpay.com/m/fix-my-itch/#highlight-can-t-consumers-see-verified-kitchen)

**Why now:** Inspection drives in Hyderabad and other cities in 2026 put kitchen hygiene in the news, and phone video makes live kitchen checks cheap.

pain 4 · frequency 4 · willingness 2 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P133 · Spices, water and milk nobody can vouch for

Households distrust packaged spice powders over adulteration and staleness, cannot verify that 20-litre water cans are truly purified, and cannot find the fat content of packaged milk or whether powder was added. Without a way to check, families either overpay for brands they still doubt or spend hours grinding and boiling at home.

**Challenge:** Help a household check the purity of its daily staples at home in under five minutes.

Epic · for consumers · India · teaches Vision, Mobile apps, Data and dashboards · also Health

<details><summary>Evidence (3) and scores (24)</summary>

- Home cooks distrust packaged spice powders over adulteration and staleness, but grinding fresh at home takes effort. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#DRCGQy9o9)
- Households buying 20-litre water cans cannot verify whether the water is truly purified as the supplier claims. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#iFtoBvpun)
- Buyer of packaged farm milk cannot find fat content or whether milk powder is used, so quality claims cannot be checked. [other, 2025-01-18](https://www.trustpilot.com/review/countrydelight.in#4)

**Why now:** Adulteration stories kept surfacing in 2025 and 2026, and phone vision can now read simple colour tests reliably.

pain 3 · frequency 4 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P144 · Expired ghee delivered in ten minutes

Nearly half of online grocery shoppers cannot see best-before dates before checkout, and near-expiry deliveries are common. Bread arrives with no manufacturing or expiry date printed, and ghee has arrived already expired and growing fungus, leaving families unsure what is safe to feed a child.

**Challenge:** Make sure no expired or undated food crosses a customer's doorstep without being caught.

Epic · for consumers · India · teaches Vision, Mobile apps, Automation and integrations · also Health

<details><summary>Evidence (3) and scores (24)</summary>

- Packaged bread delivered with no manufacturing or expiry date printed at all, leaving the buyer unable to judge whether it was safe. [other, 2026-07-22](https://www.consumercomplaints.in/bycompany/zepto-a625906.html#2)
- 48% of Indian online grocery shoppers cannot see best-before dates before checkout; quick-commerce apps flagged non-compliant, and near-expiry deliveries are common. [news, 2026-06-18](https://thefederal.com/category/business/indian-online-grocery-shoppers-struggle-to-find-product-expiry-dates-survey-247149)
- Ghee delivered already expired and growing fungus; family with a young child worried about food safety from quick-commerce dark stores. [other, 2025-08-05](https://www.consumercomplaints.in/bycompany/blinkit-a616132.html#1)

**Why now:** A 2026 consumer survey flagged quick-commerce services for hiding dates, and phone OCR reads printed dates instantly.

pain 4 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P155 · Labels that hide the sugar and the milk

Health-conscious shoppers cannot easily tell how much sugar packaged snacks contain, and parents struggle to spot ultra-processed, high-sugar products that dominate online grocery listings. Families managing allergies, such as a baby's milk-protein allergy, have to read every label line by line to find safe substitutes.

**Challenge:** Let a parent know in one glance whether a packaged food is right for their child.

Rare · for consumers · India · teaches Vision, Mobile apps, Data and dashboards · also Health

<details><summary>Evidence (3) and scores (24)</summary>

- Parents of babies with a milk-protein allergy struggle to find safe substitutes when shopping and cooking. [hn, 2026-04-15](https://news.ycombinator.com/item?id=47781757)
- Health-conscious people cannot easily tell how much sugar packaged snacks contain because labels are hard to interpret. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ADT77TMKF)
- Parents struggle to spot ultra-processed, high-sugar snacks that dominate quick-commerce listings; most want clear front-of-pack red warning labels. [other, 2025-12-03](https://www.localcircles.com/a/press/page/urban-india-food-consumption-survey)

**Why now:** Front-of-pack labelling debates and creator campaigns grew in 2025, and vision models can read Indian labels from a photo.

pain 3 · frequency 5 · willingness 2 · buildability 5 · learning 4 · novelty 2 · openness 3

</details>

### P165 · Home kitchens pricing by gut feel

Home bakers and small-batch cooks find full online stores overkill, so they take orders by chat, price by gut feel without tracking ingredient costs, and many sell at a loss without knowing it. Tiffin services fall back on one fixed daily menu because they cannot handle swaps for allergies, diets or taste, and lose the customers who need them.

**Challenge:** Let a home cook take orders, price every dish at a profit, and handle swaps, all from a phone.

Rare · for creators · global · teaches Mobile apps, Payments, Data and dashboards · also Creators

<details><summary>Evidence (3) and scores (24)</summary>

- Home bakers price by gut feel, with no tool tracking recipe ingredient costs, so many unknowingly sell at a loss. [hn, 2026-01-29](https://news.ycombinator.com/item?id=46816461)
- Tiffin subscribers get a fixed daily menu with no way to swap dishes for allergies, diets or taste. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#JSWKya52Y)
- Home bakers and small-batch makers find full e-commerce stores overkill; they need simple local ordering with pickup, delivery or shipping choices. [hn, 2025-07-22](https://news.ycombinator.com/item?id=44651690)

**Why now:** Home food selling boomed and UPI makes taking small payments free, while models can now cost a recipe from a shopping list.

pain 3 · frequency 4 · willingness 3 · buildability 5 · learning 3 · novelty 3 · openness 3

</details>

### P175 · The home kitchen that outgrows itself at fifty customers

Home bakers and tiffin cooks hit a wall as demand grows, because rules and space confine them to a home oven and stove while notebooks and chat lose track of payments and pauses past about fifty customers. The next step, renting a commercial kitchen, means paying rent before the revenue exists to cover it.

**Challenge:** Give a home food business a cheap, safe step between the home kitchen and a rented one.

Mythic · for creators · global · teaches Full-stack web, Payments, Automation and integrations · also Homes

<details><summary>Evidence (3) and scores (24)</summary>

- New food truck operators must pay recurring commissary kitchen rent before they have stable revenue to cover it. [hn, 2026-09-24](https://news.ycombinator.com/item?id=49830368)
- Home tiffin operators running subscriptions on notebooks and WhatsApp lose track of payments, pauses and dues once they pass about 40-50 customers. [other, 2026-03-10](https://www.dineopen.com/blog/how-to-start-tiffin-service-india.html)
- Cottage-food rules confine home bakers to a residential kitchen and oven, capping output and keeping per-unit costs high as demand grows. [hn, 2025-09-26](https://news.ycombinator.com/item?id=45390479)

**Why now:** Shared kitchen capacity sits idle in many cities after the cloud-kitchen shakeout, while home food demand keeps rising.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 3 · novelty 4 · openness 4

</details>

### P184 · Food subscriptions that quietly deliver less than promised

Paid food and milk subscribers find benefits withdrawn after they sign up, offers only partly honoured, deliveries erratic and items silently out of stock. Some take payment for addresses they later call unserviceable, and support refuses to act without screenshots, so subscribers pay for promises nobody tracks.

**Challenge:** Make it effortless for a subscriber to see what was promised, what arrived, and get the difference back.

Epic · for consumers · India · teaches Automation and integrations, Payments, Mobile apps · also Money

<details><summary>Evidence (4) and scores (23)</summary>

- Milk subscription app accepts payment for an address it later declares unserviceable, with no upfront clarity. [other, 2026-03-07](https://www.trustpilot.com/review/countrydelight.in#1)
- Dairy subscription customer gets only part of a promised free-days offer and is refused resolution without screenshots. [other, 2026-01-22](https://www.trustpilot.com/review/countrydelight.in#3)
- Farm-fresh milk subscriber faces erratic early-morning delivery, silent out-of-stock items and undisclosed packaging and convenience fees. [other, 2025-08-30](https://www.trustpilot.com/review/countrydelight.in#2)
- Paid food-delivery subscribers lost their rain-surge exemption and now pay surcharges anyway, leaving members feeling the membership no longer justifies its cost. [news, 2025-05-16](https://techstory.in/zomato-gold-and-swiggy-one-members-no-longer-exempt-from-rain-surge-fees/)

**Why now:** Food and milk subscriptions spread widely in 2025, and UPI Autopay makes recurring charges easy to start and hard to audit.

pain 2 · frequency 4 · willingness 2 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P192 · Ice cream that melted somewhere on the way

Frozen food and ice cream ordered online often arrive melted and refrozen, and dairy like paneer arrives sour, with no way for the buyer to tell where the cold chain broke. Delivery services push blame onto the brand or offer an unrelated coupon, so cold-chain failures go uncompensated and keep happening.

**Challenge:** Make a broken cold chain visible to the buyer and costly to whoever broke it.

Legendary · for consumers · India · teaches Vision, Data and dashboards, Mobile apps · also Manufacturing

<details><summary>Evidence (3) and scores (23)</summary>

- Customer received sour paneer; app support pushed responsibility onto the brand instead of refunding, leaving nobody accountable for spoiled dairy. [other, 2026-08-27](https://www.trustpilot.com/review/www.zepto.com#1)
- Ice cream arrived melted; app refused a refund and offered an unrelated coupon, showing cold-chain failures go uncompensated. [other, 2026-08-23](https://www.trustpilot.com/review/www.zepto.com#2)
- Frozen food and ice cream ordered online often arrives melted and refrozen, and buyers cannot tell if the cold chain broke. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#q_kaF34kd)

**Why now:** Quick commerce now delivers frozen and dairy goods in volume, and vision models can spot refreeze signs in a photo.

pain 3 · frequency 3 · willingness 2 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P200 · Dinner decided at the last minute, again

Hosts planning a last-minute get-together cannot put together good food quickly because shopping and cooking take hours, and office workers grab fried snacks in the afternoon because nothing healthy is nearby. Tracking what is already in the home kitchen is so tedious to set up that most people give up, so every food decision is made late and badly.

**Challenge:** Make tonight's food plan take two minutes, using what is already in the kitchen.

Rare · for consumers · India · teaches Vision, Voice AI, AI agents · also Health

<details><summary>Evidence (3) and scores (23)</summary>

- Tracking a home kitchen's inventory is tedious to set up, so most people give up on it. [hn, 2026-02-05](https://news.ycombinator.com/item?id=46896196)
- Hosts planning a last-minute get-together cannot make impressive food quickly; shopping and cooking take hours. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#UEda4EZ2s)
- Office workers grab fried snacks in the late afternoon because healthy options are not available nearby. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#rGniz018H)

**Why now:** Vision models can now read a fridge photo or a grocery receipt, removing the setup that killed pantry tracking.

pain 2 · frequency 5 · willingness 2 · buildability 5 · learning 4 · novelty 2 · openness 3

</details>

### P208 · Neighbourhood food shops losing to ten-minute delivery

Neighbourhood kiranas and distributors say deep-discounting quick commerce is draining their footfall, and they have no way to compete on speed. Small food brands that try to join pay non-refundable listing fees and ad wallets before seeing a sale, while shoppers who would gladly order next-day from a local butcher or baker have no way to do it.

**Challenge:** Let a neighbourhood food shop take next-day orders from its own street without paying to be listed.

Rare · for businesses · India · teaches Mobile apps, Payments, Full-stack web · also Retail

<details><summary>Evidence (3) and scores (23)</summary>

- Shoppers lack next-day delivery from local butchers and bakers, a gap between supermarkets and instant food apps. [hn, 2025-12-09](https://news.ycombinator.com/item?id=46204912)
- Neighbourhood kirana stores and FMCG distributors say quick-commerce deep discounting is draining their footfall, with no tools to compete on speed. [news, 2025-10-13](https://www.theweek.in/news/biz-tech/2025/10/13/quick-commerce-is-booming-this-shopping-season-but-why-is-the-government-not-happy.html#2)
- Bootstrapped D2C food brands face non-refundable per-SKU, per-state listing fees and mandatory ad wallets on quick-commerce apps, burning lakhs before seeing returns. [news, 2025-07-15](https://www.storyboard18.com/brand-marketing/quick-commerces-ad-fee-toll-are-platforms-squeezing-out-small-d2c-brands-73952.htm#1)

**Why now:** Quick commerce took a large share of urban grocery spend in 2025, and ONDC and UPI lowered the cost of local ordering.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P216 · Restaurant software vendors who disappear after the sale

Restaurants sign up for billing and ordering systems, then find support unresponsive, features never delivered and implementations unfinished a year later. When the system slows at peak hour or loses years of loyalty data, the restaurant pays in delayed orders and lost regulars while the vendor chases new signups.

**Challenge:** Get a small restaurant from one billing system to a better one in a weekend, with every record intact.

Epic · for businesses · global · teaches Full-stack web, Data and dashboards, Automation and integrations · also Work

<details><summary>Evidence (4) and scores (22)</summary>

- Food business's Odoo implementation stayed unfinished for over a year as partner developers kept changing. [capterra, 2026-04](https://www.capterra.com/p/135618/Odoo/reviews/#2)
- Indian restaurant's billing POS turned slow and glitchy during peak hours, delaying orders, while support could not deliver the promised features. [other, 2025-08-19](https://www.softwaresuggest.com/petpooja/reviews)
- POS vendor lost a restaurant's customer loyalty database and support offered no meaningful recovery, wiping out years of repeat-guest data. [capterra, 2025-03-13](https://www.capterra.com/p/136301/Toast-POS/reviews/#3)
- Indian restaurant using a POS found support unresponsive once onboarded; vendor seemed to prioritise signing new outlets over fixing existing customers' issues. [capterra, 2024-05-07](https://www.capterra.com/p/172163/Petpooja-Restaurant-Management-Platform/reviews/)

**Why now:** Restaurant POS churn is high and vendors compete on signup offers, while language models make data mapping and migration far cheaper.

pain 4 · frequency 3 · willingness 4 · buildability 3 · learning 2 · novelty 3 · openness 3

</details>

## Money and finance

### P006 · Gateway fees nobody checks, tickets nobody answers

Merchants find excess charges deducted on transactions and discounted pricing that was promised but never applied, sometimes costing lakhs. Tickets about it stay unanswered for months with no way to see their status, and some accounts are deactivated before anything gets fixed.

**Challenge:** Audit every fee a merchant's gateway charged last month and recover the overcharge.

Legendary · for businesses · India · teaches Data and dashboards, Automation and integrations · also Retail

<details><summary>Evidence (4) and scores (27)</summary>

- Indian merchant was overcharged by lakhs in gateway fees because promised discounted pricing was never applied to the account. [other, 2026-09-09](https://www.trustpilot.com/review/cashfree.com#2)
- Indian merchant noticed excess charges deducted on customer transactions and tickets stayed unresolved for two weeks. [other, 2026-06-22](https://www.trustpilot.com/review/razorpay.com#4)
- Merchant's support tickets went unanswered for months and there is no portal to even see a ticket's status. [other, 2026-03-24](https://www.trustpilot.com/review/cashfree.com#4)
- Indian merchant raised a dozen tickets over four months about payment gateway POS issues; support never fixed it and the account was deactivated. [capterra, 2025-04-24](https://www.capterra.in/software/192669/razorpay#1)

**Why now:** Every gateway offers downloadable settlement reports, and cheap data tooling can compare them against the contracted rate automatically.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P018 · Cloned voices and fake officials talking savings away

Fake officials stage digital arrest calls and coerce people into transferring savings before they realise it is a scam. Cheap voice clones and deepfake video calls make impersonation easy, and elderly parents already struggle with the security checks meant to protect them.

**Challenge:** Stop an impersonation scam before the money moves, without locking out the person it targets.

Mythic · for consumers · global · teaches Voice AI, AI agents

<details><summary>Evidence (3) and scores (27)</summary>

- Cheap voice clones and deepfake video calls are fuelling fraud, and businesses lack reliable ways to prove someone is a real person. [yc, 2026-07-22](https://www.ycombinator.com/rfs#fall-2026-proving-youre-human)
- Indians are coerced by 'digital arrest' calls from fake officials into transferring savings over UPI before realising it's a scam. [hn, 2026-04-17](https://news.ycombinator.com/item?id=47806321)
- Elderly parents struggle with online banking and shopping amid endless security checks and friction. [hn, 2025-02-28](https://news.ycombinator.com/item?id=43203195)

**Why now:** Voice cloning became cheap in 2025, and digital-arrest scams spread across India.

pain 5 · frequency 3 · willingness 3 · buildability 3 · learning 5 · novelty 4 · openness 4

</details>

### P030 · One gateway freeze can stop a business overnight

Online merchants have accounts blocked, settlements held or collections closed by their payment provider without explanation, sometimes for months. Money already earned stays frozen, working capital vanishes, and a business relying on a single provider has nobody to call.

**Challenge:** Keep a small online business taking payments the day its gateway freezes it.

Epic · for businesses · India · teaches Payments, Data and dashboards · also Retail

<details><summary>Evidence (6) and scores (26)</summary>

- Indian merchant's payment gateway account was permanently closed with no reason given, cutting off online collections overnight. [other, 2026-09-27](https://www.trustpilot.com/review/razorpay.com#1)
- Indian merchant says the payment gateway can hold settlement funds for up to 210 days without interest, choking working capital. [other, 2026-09-24](https://www.trustpilot.com/review/www.payu.in#1)
- Small merchant had $12k withheld by a payment processor after initial approval, with no clear path to recover the money. [hn, 2026-02-23](https://news.ycombinator.com/item?id=47122932)
- Businesses relying on a single payment provider can be locked out suddenly with nobody to contact. [hn, 2025-06-04](https://news.ycombinator.com/item?id=44181221)
- Small Indian merchant's settlements were blocked by the payment aggregator, cutting off working capital with no timeline for release. [other, 2024-12-04](https://www.consumercomplaints.in/razorpay-settlement-issue-c3521807)
- Online merchant's payment gateway account was blocked without explanation, freezing all collected funds and stalling the business. [other, 2024-02-10](https://voxya.com/consumer-complaints/put-the-settlement-on-hold-by-razorpay/221117)

**Why now:** Automated risk systems at gateways have tightened since 2025, so false freezes are more common while adding a second gateway has become easier.

pain 5 · frequency 3 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P042 · Rejected by a risk algorithm, no human to ask

Small businesses spend weeks integrating a payment gateway, then get rejected for their line of business or a tiny document typo by automated checks with no human review. Live accounts get closed for suspicious patterns caused by their own checkout design, and onboarding fees are not refunded.

**Challenge:** Get a small business approved to collect payments online on its first attempt.

Legendary · for businesses · India · teaches AI agents, Payments · also Retail

<details><summary>Evidence (6) and scores (26)</summary>

- Indian Shopify seller integrated a payment gateway fully, then had the application rejected with little explanation, wasting setup time. [other, 2026-09-25](https://www.trustpilot.com/review/cashfree.com#1)
- Indian small business paid an onboarding KYC fee, then was rejected by an automated check with no human review and no refund. [other, 2026-08-15](https://www.trustpilot.com/review/razorpay.com#2)
- Online business had its payment processor account closed for 'suspicious patterns' caused by its own upsell checkout flow, not actual fraud. [hn, 2026-02-23](https://news.ycombinator.com/item?id=47124945)
- Small business spent weeks in gateway onboarding only to be rejected for 'line of business' with no clear reason or fix. [other, 2026-01-29](https://www.trustpilot.com/review/www.payu.in#2)
- Small business waited over a month for payment gateway activation with almost no updates, unable to collect payments online meanwhile. [other, 2025-12-07](https://www.trustpilot.com/review/cashfree.com#3)
- A small online business had payouts frozen for months over a name mismatch in its payment provider's checks. [hn, 2025-08-10](https://news.ycombinator.com/item?id=44857687)

**Why now:** Rules for payment aggregators tightened, and gateways answered with automated rejections that small sellers cannot interpret.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 4 · openness 4

</details>

### P054 · Health claims rejected over fine print nobody read

People buy insurance without understanding exclusions buried in legal language, and over half of health claimants face rejection or partial approval, often over paperwork they did not understand. Premiums have jumped steeply, discharge waits stretch, and families fight insurers through ombudsman processes alone.

**Challenge:** Help a family get a health claim paid in full on the first submission.

Legendary · for consumers · India · teaches AI agents, Vision · also Health

<details><summary>Evidence (4) and scores (26)</summary>

- Indian policyholders see health premiums jump 50-200% in three years while claims get partly rejected and hospital discharge waits stretch to two days. [news, 2026-03-07](https://www.moneylife.in/article/health-insurance-premiums-rise-sharply-while-claim-experiences-remain-difficult-finds-localcircles-survey/79872.html)
- People buy insurance without understanding exclusions buried in legal language, then get surprised when claims are rejected. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#eDBoYmLDv)
- Most insurance consumer complaints in India stem from rejected claims, leaving families fighting insurers through ombudsman processes alone. [news, 2025-03-12](https://www.businesstoday.in/personal-finance/insurance/story/88-of-consumer-complaints-are-due-to-insurance-claims-being-rejected-report-467731-2025-03-12)
- Over half of Indian health insurance claimants faced rejection or partial approval, often over paperwork discrepancies they did not understand. [news, 2025-01-02](https://www.businesstoday.in/personal-finance/insurance/story/insurance-claims-over-50-health-cover-claims-faced-rejection-or-partial-approval-says-survey-459394-2025-01-02)

**Why now:** Document models can now read policies and hospital bills accurately, and steep premium hikes in 2025 and 2026 raised the stakes.

pain 5 · frequency 3 · willingness 4 · buildability 3 · learning 5 · novelty 3 · openness 3

</details>

### P066 · Scammed over UPI and nobody gives the money back

UPI fraud is roughly doubling every year, one in five families has been hit, and victims recover only a small fraction while half never complain because reporting feels pointless. Fake merchants and unregistered loan services operate freely, and gateways refuse to investigate.

**Challenge:** Get a scam victim's complaint filed everywhere it matters within the first hour.

Legendary · for consumers · India · teaches AI agents, Mobile apps

<details><summary>Evidence (4) and scores (26)</summary>

- Borrowers of unregulated instant-loan apps face abuse, contact-list shaming and morphed photos, and don't know whether an app is RBI-registered. [other, 2026-06-21](https://advocateakhilsingh.com/blog/en/2026-06-21-loan-app-harassment-fake-instant-loan-apps-india-laws-rbi-rules-report/)
- UPI fraud in India is roughly doubling yearly while victims recover only a small fraction of stolen money. [hn, 2026-02-11](https://news.ycombinator.com/item?id=46973792)
- Buyer scammed by a fake merchant on a payment gateway got no help; the gateway refused to investigate or protect the customer. [other, 2025-08-08](https://www.trustpilot.com/review/www.payu.in#4)
- One in five Indian UPI-using families hit by fraud in three years, and half of victims never complained because reporting felt pointless or complicated. [news, 2025-06-26](https://www.business-standard.com/finance/news/upi-transaction-fraud-india-survey-one-in-five-users-hit-localcircles-125062601141_1.html)

**Why now:** Central fraud reporting exists and fast reporting improves recovery, yet victims do not know the steps.

pain 5 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P078 · Small suppliers quietly bankroll their biggest customers

Small suppliers wait sixty to ninety days or more for big buyers to pay while paying their own vendors in thirty, borrowing at high interest to bridge the gap. Wages, raw material and loan repayments get squeezed, and some buyers now avoid registered small suppliers to dodge the 45-day rule.

**Challenge:** Shorten the gap between delivery and payment for a small supplier by a month.

Epic · for businesses · India · teaches Data and dashboards, Payments · also Manufacturing

<details><summary>Evidence (5) and scores (25)</summary>

- The 45-day MSME payment rule is pushing some buyers to avoid registered small suppliers, so the protection itself costs them orders. [news, 2026-07-26](https://www.taxscan.in/top-stories/rajya-sabha-notes-impact-of-section-43bh-of-finance-act-2023-on-msme-payments-and-buyer-evasion-read-order-1449331)
- Small suppliers end up financing large buyers; late receivables squeeze wages, raw material purchases and loan repayments, while enforcement stays inconsistent. [news, 2026-01-30](https://ascendants.in/business-stories/delayed-msem-payments-8-1l-crore/)
- Small suppliers wait sixty to ninety days for big buyers to pay while paying their own vendors in thirty, borrowing expensively to bridge it. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#eHlEGur1H)
- MSMEs supplying government buyers borrow at high interest to survive unpaid dues; one supplier spent six months chasing a single delayed payment. [news, 2026-01-09](https://swarajyamag.com/economy/beyond-gem-portal-why-msmes-are-still-waiting-for-their-money-from-government-buyers)
- Large corporate customers routinely pay small suppliers 90+ days late, forcing constant follow-up and starving the supplier's cash flow. [hn, 2025-10-10](https://news.ycombinator.com/item?id=45538396)

**Why now:** The 45-day payment rule changed buyer behaviour in 2025 and 2026 while enforcement stayed weak, so suppliers need leverage of their own.

pain 5 · frequency 5 · willingness 4 · buildability 3 · learning 3 · novelty 2 · openness 3

</details>

### P090 · Foreign client paid, freelancer still waiting

Freelancers and small sellers earning from abroad see payouts held for days, accounts blocked over address typos or missed OTPs, and funds returned to clients without clear reason. Surprise fees and poor conversion routes shave off more, and some clients never pay what they promised.

**Challenge:** Get an Indian freelancer's foreign earnings into their bank on a predictable day, at a known cost.

Legendary · for creators · India · teaches Payments, Automation and integrations · also Creators

<details><summary>Evidence (8) and scores (25)</summary>

- Marketplace seller locked out of payout account for a week, unable to receive OTP while waiting on an Etsy payout. [other, 2026-10](https://www.trustpilot.com/review/www.payoneer.com#3)
- Freelancer's cross-border funds were never credited and the payout account was blocked, with months passing and no money returned. [other, 2026-09-29](https://www.trustpilot.com/review/www.payoneer.com#1)
- Indian freelancer's incoming foreign payment was held for days, then the account closed and funds sent back to the client without clear reason. [other, 2026-09-29](https://www.trustpilot.com/review/skydo.com#1)
- Seller's payout account registration stalled because an automated system kept rejecting documents over a tiny address typo. [other, 2026-09-28](https://www.trustpilot.com/review/www.payoneer.com#2)
- Indian exporter discovered a surprise extra 1% fee only when a client payment landed, with no advance notice of the price change. [other, 2026-09-08](https://www.trustpilot.com/review/skydo.com#2)
- Freelancer promised 24-48 hour payouts waited a week while compliance staff asked irrelevant questions about a routine client payment. [other, 2026-08-26](https://www.trustpilot.com/review/skydo.com#3)
- Indian seller lost about $10K on conversion because the cross-border service routed the currency through an unfavourable path. [other, 2026-05-19](https://www.trustpilot.com/review/skydo.com#4)
- Freelancers in low-wage markets are promised fees that clients then fail to pay. [hn, 2026-03-26](https://news.ycombinator.com/item?id=47530891)

**Why now:** Cross-border freelancing from India keeps growing and new low-fee collection services have launched, yet holds and surprise fees still dominate complaints.

pain 5 · frequency 4 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P102 · Hidden fees buried in card and bank statements

Cardholders pay thousands of crores a year in surprise annual fees, late fees and add-on charges buried in statements, and online banking users struggle to spot or reverse them. Surcharges appear at checkout without warning, and trading fees arrive with no breakdown of what was charged and why.

**Challenge:** Find every fee a household paid last year that it could have avoided or reversed.

Epic · for consumers · India · teaches Data and dashboards, Vision

<details><summary>Evidence (4) and scores (25)</summary>

- Online shopper was hit with a hidden 2.5% surcharge at checkout through a wallet without any prior warning. [other, 2026-03-16](https://www.trustpilot.com/review/www.payu.in#3)
- Indian online banking users find hidden fees debited, add-ons slipped in and subscriptions hard to cancel; most can't easily spot or reverse them. [news, 2026-02-24](https://www.forbesindia.com/article/news/survey-shows-rampant-mis-selling-on-online-banking-sites/2991661/1)
- Investor saw unexplained fee deductions on trades and couldn't get a breakdown of what was charged and why. [other, 2026-02-06](https://www.trustpilot.com/review/groww.in#4)
- Indian cardholders unknowingly pay thousands of crores in hidden credit card charges like surprise annual fees and late fees buried in statements. [news, 2025-02-25](https://www.business-standard.com/companies/interviews/cred-detected-rs-11-000-crore-in-hidden-charges-related-to-credit-cards-125022501169_1.html)

**Why now:** Statement parsing with document models is now cheap and accurate, making a personal fee audit practical.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P114 · Tax notices and rule changes small firms cannot read

Small taxpayers get GST demand notices and do not know whether to pay or reply, risking penalties or an order passed without them. Rules such as e-way bill requirements keep shifting, and compliance still means reading dense rules and cross-checking documents by hand.

**Challenge:** Tell a small business what a notice or rule change means for it, and what to file by when.

Epic · for businesses · India · teaches AI agents, Voice AI

<details><summary>Evidence (3) and scores (25)</summary>

- Repeatedly shifting e-way bill rule changes leave small businesses and their billing software vendors unsure what to comply with and when. [news, 2026-07-30](https://www.livemint.com/news/india/gstn-again-defers-e-way-bill-changes-ahead-of-1-august-rollout-11785413948763.html)
- Small taxpayer received a GST demand notice and does not know whether to just pay or must reply, risking penalties or an ex parte order. [forum, 2025-09-05](https://www.caclubindia.com/forum/drc-01-issued-613943.asp)
- Compliance and audit work means reading dense rules and cross-checking documents by hand, and costs keep rising. [yc, 2025-01-30](https://www.ycombinator.com/rfs#spring-2025-compliance-audit)

**Why now:** GST notices rose sharply with automated matching, and language models can now explain a notice in regional languages.

pain 4 · frequency 3 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P126 · Accountants exporting ledgers one screen at a time

Accountants and small-firm staff pull ledgers out of desktop accounting packages piece by piece to analyse them, which is slow and introduces errors. Bulk edits are capped at a few dozen items, reports are missing, and the day goes on switching between full-screen spreadsheets.

**Challenge:** Turn a full day of ledger exports and edits into ten minutes.

Epic · for businesses · India · teaches Automation and integrations, Data and dashboards · also Work

<details><summary>Evidence (4) and scores (25)</summary>

- Bookkeeper can bulk-update only 25 items at a time and lacks reports and project cost breakdowns, wasting hours on repetitive edits. [capterra, 2026-07-30](https://www.capterra.com/p/163115/Zoho-Books/reviews/?page=2#3)
- Accountants find getting data out of their desktop accounting package a headache, exporting piece by piece instead of one clean dump. [capterra, 2026-06-22](https://www.capterra.in/software/170410/tally-erp-9#1)
- TallyPrime users must pull ledgers and data out piece by piece to analyse them, which is slow and introduces errors into reports. [capterra, 2026-06](https://www.capterra.com/p/127762/Tally-ERP-9/reviews/#1)
- Accountants juggling many full-screen spreadsheets lose time switching between windows all day. [hn, 2026-04-22](https://news.ycombinator.com/item?id=47865138)

**Why now:** AI coding tools make small connectors to desktop accounting software cheap to build.

pain 3 · frequency 5 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P138 · Reconciling the books by hand in 2026

Bookkeeping is repetitive and checkable against bank feeds, yet small firms still reconcile ledgers by hand. Bank feeds into accounting software keep dropping, so transactions go missing and the slowest part of the work resists automation.

**Challenge:** Reconcile a small firm's month of bank transactions without a human touching the obvious matches.

Rare · for businesses · global · teaches AI agents, Automation and integrations

<details><summary>Evidence (3) and scores (25)</summary>

- Bank feed into accounting software keeps dropping, so transactions go missing and support cannot fix the connection. [capterra, 2026-09-24](https://www.capterra.com/p/163115/Zoho-Books/reviews/?page=2#2)
- Bookkeeping is repetitive and checkable against bank feeds, yet small firms still reconcile ledgers by hand. [hn, 2025-12-16](https://news.ycombinator.com/item?id=46293790)
- Reconciling accounts is the slow part of accounting work and still resists automation. [hn, 2025-12-12](https://news.ycombinator.com/item?id=46240798)

**Why now:** Language models handle messy narration text that rule-based matchers could not.

pain 3 · frequency 5 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P149 · Small firms flying blind on next month's cash

Standard small-business accounting software has no basic cash forecasting, so owners build spreadsheet workarounds to see what is coming. Settlements arrive later than expected, daily cash planning gets harder, and a full-time finance head is out of reach.

**Challenge:** Show a small owner, each morning, how much cash they will have in thirty days.

Rare · for businesses · India · teaches Data and dashboards, Full-stack web

<details><summary>Evidence (3) and scores (25)</summary>

- Merchants see settlements arrive later than expected and struggle to find dashboard settings, making daily cash planning harder. [capterra, 2026-07-16](https://www.capterra.in/software/192669/razorpay#2)
- Standard small-business accounting software has no basic cash forecasting, so owners build spreadsheet workarounds to see what's coming. [hn, 2026-06-09](https://news.ycombinator.com/item?id=48454400)
- Growing small companies need senior financial planning help but cannot afford a full-time finance head. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#tDc622Bfq)

**Why now:** Bank and gateway data can now be exported or shared through India's Account Aggregator framework, making automatic forecasts possible.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P159 · Evenings lost to chasing invoices by hand

Micro businesses spend ten or more hours a week making, chasing and matching invoices by hand because heavier accounting software does not fit. Late-paying customers strain small suppliers, and owners lose evenings chasing payments instead of doing billable work or being with family.

**Challenge:** Give a small business owner their evenings back from invoice chasing.

Rare · for businesses · global · teaches Voice AI, Automation and integrations · also Work

<details><summary>Evidence (3) and scores (25)</summary>

- Late-paying customers strain small suppliers, and chasing payments eats time both at work and in family businesses. [hn, 2026-04-04](https://news.ycombinator.com/item?id=47638685)
- Small contractors lose their evenings chasing unpaid invoices by hand instead of spending time with family or doing billable work. [hn, 2026-03-27](https://news.ycombinator.com/item?id=47545486)
- Micro businesses spend ten or more hours a week making, chasing and matching invoices by hand because ERP software is too heavy. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#V5L8PlwDq)

**Why now:** Voice agents that can call a customer in a regional language and log a promise to pay became cheap in 2025.

pain 4 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P169 · Losing chargebacks the merchant should have won

Small online merchants lose chargeback disputes because writing evidence-backed responses is slow and confusing, and fraudulent disputes get no real help from the payment provider. Bots testing stolen cards add chargebacks and force funds to be held while orders are checked by hand.

**Challenge:** Win a fair chargeback for a small merchant with fifteen minutes of their time.

Rare · for businesses · global · teaches AI agents, Payments · also Retail

<details><summary>Evidence (4) and scores (24)</summary>

- Merchant with a large chargeback dispute and documentary evidence could not get any response from the gateway's support team. [other, 2026-09-12](https://www.trustpilot.com/review/razorpay.com#3)
- Small merchants lose chargeback disputes because writing evidence-backed responses is slow and confusing. [hn, 2026-04-15](https://news.ycombinator.com/item?id=47777094)
- Online merchants see bots testing stolen cards, triggering chargebacks and forcing them to hold funds and check orders by hand. [hn, 2025-06-05](https://news.ycombinator.com/item?id=44190066)
- Small online sellers get hit by fraudulent payment disputes and the payment provider offers no real help. [hn, 2025-06-04](https://news.ycombinator.com/item?id=44177508)

**Why now:** Language models can now assemble evidence packets from order and delivery data in seconds.

pain 4 · frequency 3 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P179 · Money debited, transaction failed, nobody owns the refund

Payments get debited while the merchant, gateway or booking system shows them as failed, and refunds go missing while each party points at the other. Withdrawals, account closures and tax refunds sit in limbo for days or months with no visible reason or status.

**Challenge:** Get a stuck refund back to a consumer without them chasing two companies.

Epic · for consumers · India · teaches AI agents, Automation and integrations

<details><summary>Evidence (7) and scores (24)</summary>

- Indian payer's money was debited through a payment gateway while the merchant portal showed the transaction as failed, leaving them chasing both sides. [other, 2026-09-09](https://www.consumercomplaints.in/razorpay-deducted-money-but-failed-money-c3544650)
- Investor trying to close a brokerage account waited over a month despite submitting everything, with no clear status updates. [other, 2026-07-27](https://www.trustpilot.com/review/groww.in#2)
- Pension contribution was debited from the bank but the transaction never completed and no receipt was generated, with no clear owner to fix it. [other, 2026-04-04](https://www.consumercomplaints.in/razorpay-razorpay-nps-contribution-amount-debited-from-bank-but-did-not-complete-transaction-and-receipt-is-not-generated-c3540561)
- Indian investor's withdrawal sat in limbo for two days across several internal steps, with no explanation of where the money was. [other, 2026-03-20](https://www.trustpilot.com/review/groww.in#3)
- Salaried Indian taxpayers' refunds sat stuck for months with no visible reason, risking missing the deadline to revise returns. [news, 2025-12-22](https://www.business-standard.com/finance/personal-finance/itr-refund-stuck-experts-warn-december-31-delays-could-block-revisions-125122200655_1.html)
- Customer's refund routed via a payment gateway stayed missing despite repeated follow-ups; merchant and gateway each point at the other. [other, 2025-08-01](https://www.consumercomplaints.in/razorpay-refund-not-received-after-multiple-follow-ups-c3532869)
- Train ticket payment was deducted but the booking failed; traveller had no visibility into when or whether the money would come back. [other, 2025-03-18](https://www.consumercomplaints.in/razorpay-amount-deducted-from-bank-but-ticket-irctc-not-booked-c3526259)

**Why now:** UPI volumes keep climbing, and failed-but-debited cases climb with them while reversal timelines are poorly enforced.

pain 3 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P188 · Locked out after a death or a lost phone

After a death, families spend months reaching scattered accounts, documents and assets because succession paperwork is slow and few people prepare. Losing an email account or a phone holding authentication codes can lock someone out of banking and work with no human to help.

**Challenge:** Make sure the people who need your accounts can reach them, and nobody else can.

Legendary · for consumers · global · teaches Full-stack web, AI agents

<details><summary>Evidence (5) and scores (24)</summary>

- After a stolen phone, people get locked out of accounts protected by app codes and find no human to help. [hn, 2026-09-17](https://news.ycombinator.com/item?id=49742976)
- A spouse would face a maze of accounts and subscriptions after a partner dies, and nothing organises it beforehand. [hn, 2026-04-08](https://news.ycombinator.com/item?id=47689759)
- After a death, families struggle for months to access accounts because succession paperwork is slow and scattered. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#UU3NdQGBD)
- Families cannot reach a person's scattered accounts, documents and assets after death, and few people prepare for it. [hn, 2025-08-13](https://news.ycombinator.com/item?id=44888799)
- Losing access to a personal email account can lock someone out of banking, work and every service tied to it. [hn, 2025-04-21](https://news.ycombinator.com/item?id=43757010)

**Why now:** More of a household's money and paperwork now sits behind phone-based authentication than ever.

pain 5 · frequency 2 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P196 · Input credit lost because a supplier filed late

Small businesses lose input tax credit whenever a supplier files late or invoices fail to appear in their auto-drafted returns, and stricter matching now triggers notices for small mismatches. Reconciling books against returns at year end is slow, and errors surface only when the notice arrives.

**Challenge:** Catch every GST mismatch in the month it happens, not when the notice lands.

Rare · for businesses · India · teaches Data and dashboards, Automation and integrations

<details><summary>Evidence (3) and scores (24)</summary>

- GST notices are rising because sales returns, summary returns and books don't match and suppliers' non-filing wipes out buyers' credits. [news, 2026-09-02](https://www.caclubindia.com/articles/gst-notices-on-the-rise-key-issues-common-mismatches-and-major-compliance-areas-taxpayers-must-review-56163.asp)
- Under stricter GST matching, small Indian businesses lose input credit whenever a supplier files late, and get auto-notices for 5% mismatches. [other, 2026-07-25](https://beancount.io/blog/2026/07/25/india-gst-2-0-slabs-itc-matching-small-business-guide)
- Business booked input tax credit on ten invoices but only eight appeared in GSTR-2B, leaving an unexplained mismatch at year-end close. [forum, 2025-01-11](https://www.caclubindia.com/forum/2b-itc-reconciliation-611504.asp)

**Why now:** Stricter automated GST matching in 2025 and 2026 turned small mismatches into notices.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P204 · Freelancers chasing clients who stopped answering

Freelancers face at least one unpaid invoice a month, burn hours drafting awkward follow-ups, and lose thousands to clients who vanish after receiving the final work. Reminders go out late or not at all, and invoicing, tracking and escalation are stitched across tools built for bigger companies.

**Challenge:** Make sure a freelancer is paid before the final files leave their hands.

Rare · for creators · global · teaches AI agents, Automation and integrations · also Creators

<details><summary>Evidence (6) and scores (24)</summary>

- A freelancer lost thousands to clients who vanished after receiving the final deliverables. [hn, 2026-03-22](https://news.ycombinator.com/item?id=47483215)
- Freelancers burn hours drafting awkward follow-up emails to clients who have not paid, with no simple system to escalate politely. [hn, 2026-03-04](https://news.ycombinator.com/item?id=47243082)
- Payment reminders from small-business billing software sometimes go out late, so overdue customers aren't nudged on time. [capterra, 2025-11-24](https://www.capterra.in/software/1012826/vyapar#3)
- Clients ghost invoices after work is delivered; freelancers only learn too late that they should have stopped work for late payers. [hn, 2025-10-13](https://news.ycombinator.com/item?id=45566051)
- Freelancers face at least one unpaid invoice every month and dread writing awkward payment reminders. [hn, 2025-10-10](https://news.ycombinator.com/item?id=45537969)
- Freelancers waste time stitching together invoicing, payment tracking and reminders across tools that are built for bigger companies. [hn, 2025-02-01](https://news.ycombinator.com/item?id=42897450)

**Why now:** Freelancing has grown with remote work, and payment links make milestone collection easy.

pain 4 · frequency 4 · willingness 3 · buildability 5 · learning 3 · novelty 2 · openness 3

</details>

### P212 · Software bills that creep up every renewal

Small firms find basic features behind premium add-ons, hidden costs after purchase and automatic yearly price rises they have no leverage to fight. Usage-based pricing for AI services makes monthly costs even harder to budget.

**Challenge:** Cut a small company's software spend by a fifth without losing a feature it uses.

Rare · for businesses · global · teaches Data and dashboards, AI agents · also Work

<details><summary>Evidence (4) and scores (23)</summary>

- Companies face automatic yearly subscription price rises and lack the tracking or leverage to push back. [hn, 2026-08-29](https://news.ycombinator.com/item?id=49494291)
- Teams struggle to budget for AI usage because token-based pricing makes monthly costs unpredictable. [hn, 2026-01-27](https://news.ycombinator.com/item?id=46781011)
- Indian buyer of cloud accounting software hit hidden costs after purchase and got no useful support response for seven months. [capterra, 2025-10-03](https://www.capterra.in/software/134507/zoho-books#1)
- Bootstrapped Indian startups find accounting software gets expensive because basic needs sit behind premium add-on subscriptions. [capterra, 2025-02-10](https://www.capterra.in/software/134507/zoho-books#2)

**Why now:** AI usage pricing made software bills volatile in 2025 and 2026 just as small teams adopted more services.

pain 3 · frequency 3 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P219 · Compliance mandates arrive before the software is ready

Mandatory e-invoicing networks mean small firms can no longer email a PDF invoice and must pay an intermediary to connect. Accounting services switch on compliance features without warning or lack automation for local tax rules, so invoices are missed and payments are delayed.

**Challenge:** Get a small firm compliant with a new invoicing mandate in an afternoon, not a quarter.

Epic · for businesses · global · teaches Automation and integrations, Full-stack web

<details><summary>Evidence (3) and scores (23)</summary>

- Small retailer finds accounting tool lacks automation and flexibility for retail GST rules, forcing manual card-payment processing. [capterra, 2026-01-09](https://www.capterra.com/p/163115/Zoho-Books/reviews/?page=2#1)
- Mandatory e-invoicing networks mean small firms can no longer email PDF invoices and must pay an intermediary to connect. [hn, 2025-01-22](https://news.ycombinator.com/item?id=42789898)
- An accounting service switched on e-invoicing without warning, so clients missed invoices and payments were delayed. [hn, 2025-01-22](https://news.ycombinator.com/item?id=42790334)

**Why now:** E-invoicing mandates expanded across Europe and to smaller businesses in India during 2025 and 2026.

pain 3 · frequency 4 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P224 · Freelancers find out their tax bill far too late

Independent coaches and side-gig earners are unsure when GST registration kicks in or what they owe, and nobody tells them until it is late. Preparing a profit and loss summary for an accountant is tedious, so taxes get put off and penalties follow.

**Challenge:** Give a freelancer a running view of their tax position that is ready to hand to an accountant.

Epic · for creators · global · teaches AI agents, Data and dashboards · also Creators

<details><summary>Evidence (3) and scores (23)</summary>

- Independent wellness coach crossing the GST threshold is unsure when registration kicks in and how to bill clients during the transition. [forum, 2026-03-11](https://www.caclubindia.com/forum/clarification-on-gst-applicability-for-small-service-providers-614963.asp)
- Side-gig earners put off taxes because preparing a profit and loss summary for their accountant is tedious. [hn, 2025-04-28](https://news.ycombinator.com/item?id=43823956)
- Individuals carry the burden of calculating their own taxes correctly, with nobody telling them what they owe. [hn, 2025-03-11](https://news.ycombinator.com/item?id=43338472)

**Why now:** Freelance and creator income in India has grown into tax brackets and GST thresholds for many, and document models make statement-to-summary automatic.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P229 · Shop billing that crashes and payroll done by hand

Small shops find their billing software crashes, barcode printing fails and invoices shared as messages arrive blank, while feature requests go unanswered. Firms with under ten staff still calculate salaries by hand, juggling leave, overtime and bonuses, because payroll modules need training they cannot afford.

**Challenge:** Make billing and monthly salaries for a ten-person shop take minutes and never fail at the counter.

Rare · for businesses · India · teaches Mobile apps, Full-stack web · also Retail

<details><summary>Evidence (4) and scores (23)</summary>

- Small firm staff struggle with payroll and manufacturing modules in their accounting software; beginners need training they cannot afford. [capterra, 2026-04-24](https://www.capterra.in/software/170410/tally-erp-9#2)
- Businesses with under ten staff calculate salaries by hand each month, juggling leave, overtime and bonuses. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#uVF8fjywK)
- Small Indian shop's billing app crashes often, barcode printing fails and invoices shared on WhatsApp arrive as blank files. [capterra, 2025-08-14](https://www.capterra.in/software/1012826/vyapar#1)
- Shopkeeper can't customise their billing software to how they work, and feature requests to the vendor go unanswered. [capterra, 2025-02-13](https://www.capterra.in/software/1012826/vyapar#2)

**Why now:** Low-cost Android phones are now the shop counter, and mobile-first billing can work offline.

pain 3 · frequency 5 · willingness 3 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P234 · Cryptic UPI names turn every statement into a puzzle

Spending is scattered across UPI, cards, wallets and subscriptions, and cryptic merchant names make small payments impossible to recall weeks later. Budgeting that needs manual entry gets abandoned within weeks, and bank sync shows up late or not at all.

**Challenge:** Tell someone where their money went last month without asking them to type anything.

Rare · for consumers · India · teaches Mobile apps, Data and dashboards

<details><summary>Evidence (4) and scores (22)</summary>

- Personal finance app users can't rely on bank transaction sync; data shows up late or not at all, breaking their budget. [hn, 2026-02-09](https://news.ycombinator.com/item?id=46952074)
- People lose track of monthly spending because payments are scattered across UPI apps, cards, wallets and subscriptions. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#LEFMvGxtt)
- People reviewing bank statements cannot recall small UPI payments weeks later because merchant names are cryptic. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#OkUljLgKA)
- Budgeting apps demand so much manual entry and feel so abstract that people abandon the habit within weeks. [hn, 2025-12-29](https://news.ycombinator.com/item?id=46417566)

**Why now:** India's Account Aggregator network and on-device models make automatic, private categorisation of UPI payments practical.

pain 2 · frequency 5 · willingness 2 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

## Health and fitness

### P003 · One in five clinic appointments is an empty chair

Indian specialist clinics lose about a fifth of booked appointments to no-shows, and few even track it. Patients can only reschedule by calling during hours, so cancellations silently become no-shows while staff spend hours on confirmation calls.

**Challenge:** Cut a clinic's no-shows in half without adding a single confirmation call to the front desk.

Epic · for businesses · India · teaches Voice AI, Automation and integrations, AI agents

<details><summary>Evidence (3) and scores (28)</summary>

- Audit of 47 Indian specialist practices found about one in five booked appointments are no-shows, and few clinics even track it. [other, 2026-04-18](https://www.engageoagency.com/blog/how-to-reduce-patient-no-shows-indian-clinics#1)
- Indian clinic patients can only reschedule by calling during hours or replying to unmonitored SMS, so cancellations silently become no-shows. [other, 2026-04-18](https://www.engageoagency.com/blog/how-to-reduce-patient-no-shows-indian-clinics#2)
- Indian hospital user finds clinic software costly for basic features and unclear on WhatsApp integration for patient communication. [capterra, 2024-03-25](https://www.capterra.in/software/167778/ray#1)

**Why now:** Voice agents in Hindi and regional languages became cheap enough in 2025 to call every patient the day before.

pain 4 · frequency 5 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P015 · Patients carry their history in a plastic bag

Patients carry folders of paper reports and X-rays between doctors because hospitals rarely give digital copies. A doctor at a new hospital cannot see past prescriptions or allergies, online doctors skip uploaded reports, and families of sick children bounce between hospitals with nobody joining the records.

**Challenge:** Turn a bag of paper reports into a one-page history any new doctor can read in a minute.

Legendary · for consumers · India · teaches Vision, AI agents, Mobile apps

<details><summary>Evidence (4) and scores (28)</summary>

- Online doctor on a pharmacy app did not look at the uploaded prescriptions and reports before advising. [other, 2026-08-22](https://www.trustpilot.com/review/pharmeasy.in#2)
- Doctors treating a patient at a new hospital cannot see past prescriptions, allergies or history because records stay siloed. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#AuFT2T9ud)
- Patients carry paper folders of reports and X-rays between doctors because hospitals rarely give digital copies. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#HsE5aQuMc)
- Families of a sick child bounce between hospitals with nobody pulling all the records together into a diagnosis. [hn, 2025-08-27](https://news.ycombinator.com/item?id=45035141)

**Why now:** India's ABHA health IDs and cheap document vision models make a patient-held summary practical in 2025.

pain 5 · frequency 4 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 4

</details>

### P027 · Caring for a parent from another city

Earning children who live away from ageing parents find arranging care fragmented and stressful. Professional coordination can cost thousands of dollars a year, and caregivers watch their careers stall under the time it takes.

**Challenge:** Let a working child coordinate a parent's doctors, medicines and helpers in ten minutes a day.

Legendary · for consumers · global · teaches Voice AI, Automation and integrations, Mobile apps · also Homes

<details><summary>Evidence (3) and scores (28)</summary>

- Caring for a parent with dementia consumes so much time and money that the caregiver says their career has completely stalled. [hn, 2026-07-18](https://news.ycombinator.com/item?id=48960813)
- Sole earners living in another city find arranging care for ageing parents fragmented and stressful. [fixmyitch, 2026-01](https://razorpay.com/m/fix-my-itch/#highlight-is-caring-for-aging-parents-for-sole)
- Adult child was quoted about twenty thousand dollars a year for concierge care coordination for parents with complex conditions. [hn, 2025-06-26](https://news.ycombinator.com/item?id=44384505)

**Why now:** Voice models can now hold a natural call with an elderly parent in their own language.

pain 5 · frequency 5 · willingness 4 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P039 · Almost nothing online is built for a fading memory

Children far away struggle to notice gradual cognitive decline in a parent from ordinary phone calls. The internet is dangerous for declining elders, yet daily life is nearly impossible without it, and almost no technology is built for them.

**Challenge:** Help a family notice early when a parent's memory slips, and keep that parent safe online.

Mythic · for consumers · global · teaches Voice AI, AI agents, Mobile apps

<details><summary>Evidence (3) and scores (28)</summary>

- Families already provide unpaid care for ageing relatives while caregivers are scarce and almost no technology is built for older people. [yc, 2026-07-22](https://www.ycombinator.com/rfs#fall-2026-ai-for-the-aging-population)
- The internet is dangerous for cognitively declining elderly parents, yet daily life is nearly impossible without it. [hn, 2025-08-26](https://news.ycombinator.com/item?id=45025176)
- Adult children living far away struggle to notice gradual cognitive decline in an ageing parent from ordinary phone calls. [hn, 2025-01-06](https://news.ycombinator.com/item?id=42609272)

**Why now:** Speech models can track changes in a voice over time, and digital payment scams on elders rose sharply.

pain 5 · frequency 4 · willingness 3 · buildability 3 · learning 5 · novelty 4 · openness 4

</details>

### P051 · Diet clients quit logging food by the second week

Online nutrition coaches depend on client food logs, but clients find typing every meal tedious and the logs sync unreliably from separate trackers. Coaches end up advising on half the picture, and clients drift when replies come late.

**Challenge:** Let a diet client log a whole day of meals in under a minute, and let the coach see it the same day.

Epic · for creators · global · teaches Vision, Mobile apps, Data and dashboards · also Food

<details><summary>Evidence (5) and scores (27)</summary>

- Nutrition coach says clients find food logging tedious and would rather send meal photos than log entries. [capterra, 2026-09-09](https://capterra.com/p/202837/Everfit/reviews/#4)
- Diet program too rigid for someone with unpredictable work hours; coach replies came late and weight went up. [other, 2026-03-31](https://www.trustpilot.com/review/healthifyme.com#7)
- Trainer says client calorie tracker lacks barcode scanning and smart scale or watch integration, so client data stays incomplete. [capterra, 2025-12-09](https://capterra.com/p/141155/PT-Distinction/reviews/#1)
- Online fitness coach fights persistent nutrition-sync failures and clumsy bulk management of automated client messages. [capterra, 2025-07-02](https://www.capterra.com/p/140262/Trainerize/reviews/#4)
- Nutrition coach complains client food logs from a separate tracker sync unreliably into the coaching platform. [capterra, 2025-05-30](https://www.capterra.com/p/140262/Trainerize/reviews/#3)

**Why now:** Vision models in 2025 can name dishes from a phone photo cheaply enough to run on every meal.

pain 3 · frequency 5 · willingness 4 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P063 · The listed doctor is not at the clinic

Patients book a specialist online and find the doctor on leave, not practising at that hospital, or the clinic shut, after travelling there. Fees shown online can be half what the clinic charges, and visitors in a strange city cannot tell which clinic to trust.

**Challenge:** Make sure a patient who books a doctor finds that doctor, at that place, at that price.

Legendary · for consumers · India · teaches Voice AI, AI agents, Data and dashboards

<details><summary>Evidence (6) and scores (27)</summary>

- Confirmed specialist appointment turned out useless because the doctor does not actually practise at the listed hospital. [other, 2026-08-28](https://www.trustpilot.com/review/practo.com#4)
- Consultation fee shown online was half what the clinic actually charged at the visit, and support chat history vanished. [other, 2026-07-22](https://www.trustpilot.com/review/practo.com#6)
- Booked doctor was on leave and the appointment could not be confirmed despite repeated calls to an automated support line. [other, 2026-06-13](https://www.trustpilot.com/review/practo.com#8)
- Visitors who fall ill in an unfamiliar city do not know which clinic to trust, whether staff speak their language, or likely costs. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#I_cxirYa4)
- Orthopaedic appointment booked online but doctor was on leave; neither hospital nor patient was notified before the trip. [other, 2025-12-15](https://www.trustpilot.com/review/practo.com#10)
- Patient travelled to a booked clinic appointment only to find the clinic closed, with no prior notice from anyone. [other, 2025-11-26](https://www.trustpilot.com/review/practo.com?page=2#7)

**Why now:** Voice agents can now call a clinic reception in Hindi or Kannada for a few rupees per call.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 4 · openness 4

</details>

### P075 · Nobody can tell what a hospital visit should cost

Patients get huge itemised bills with no upfront price to compare against, and the same visit can cost far more depending on how it is coded. People without cover pay the highest rates, and medical bills push families into debt.

**Challenge:** Tell a patient before admission what a routine procedure should cost, and flag what does not belong on the bill.

Legendary · for consumers · global · teaches Vision, Data and dashboards, AI agents · also Money

<details><summary>Evidence (4) and scores (27)</summary>

- Hospital patients receive huge itemised bills with no upfront price for a routine procedure to compare against. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#Xh2l5mZJp)
- Patients cannot tell which billing code a clinic will use, so the same visit can cost far more without warning. [hn, 2025-05-24](https://news.ycombinator.com/item?id=44077929)
- Gig workers without health cover pay the highest medical rates, and medical bills push people into bankruptcy. [hn, 2025-05-24](https://news.ycombinator.com/item?id=44078216)
- A routine doctor visit billed above a thousand dollars left the patient unable to judge whether the charge was fair. [hn, 2025-05-23](https://news.ycombinator.com/item?id=44077277)

**Why now:** Indian courts and regulators pushed hospitals in 2024 and 2025 to publish standard rates, and bill photos can now be read reliably.

pain 5 · frequency 3 · willingness 4 · buildability 3 · learning 5 · novelty 3 · openness 4

</details>

### P087 · Patients cannot check the medicine in their hand

Medicines arrive with expiry dates washed off, vaccines arrive warm, and the wrong drug is delivered with returns refused. Patients and even doctors doubt whether cheaper generics are the same, so they overpay or take risks they cannot see.

**Challenge:** Let anyone point a phone at a medicine strip and know it is the right drug, in date and genuine.

Legendary · for consumers · India · teaches Vision, Mobile apps

<details><summary>Evidence (4) and scores (27)</summary>

- Wrong medicine delivered and return refused because the customer supposedly verified it before delivery. [other, 2026-09-03](https://www.trustpilot.com/review/pharmeasy.in#8)
- Vaccines delivered at room temperature rather than chilled, so the cold chain broke and the money was wasted. [other, 2026-08-21](https://www.trustpilot.com/review/pharmeasy.in#7)
- Medicines arrived in wet damaged packaging with expiry dates washed off, complaint unresolved for months. [other, 2026-03-29](https://www.trustpilot.com/review/pharmeasy.in#6)
- Doctors and patients stick to costly branded drugs over identical generics because they doubt generic quality. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#FzBHG29fE)

**Why now:** India made QR codes mandatory on its top 300 drug brands from 2023, giving a phone something to verify against.

pain 5 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 4 · openness 4

</details>

### P099 · Health claims rejected for reasons nobody explains

Over 40 percent of surveyed Indian policyholders say claims were rejected or part paid for reasons they consider invalid, and cashless approvals keep patients waiting up to two days at discharge. Insurers dispute coverage and nobody explains why.

**Challenge:** Help a family fight a rejected health claim with the right clause and the right letter, in one evening.

Legendary · for consumers · India · teaches AI agents, Vision, Full-stack web · also Money

<details><summary>Evidence (4) and scores (27)</summary>

- Graduate students on university health plans hit frustrating insurance coverage disputes. [hn, 2026-07-21](https://news.ycombinator.com/item?id=48988770)
- Patients fall behind on dental bills because insurers dispute coverage and nobody explains why. [hn, 2026-04-04](https://news.ycombinator.com/item?id=47639329)
- Over 40 percent of surveyed Indian policyholders say health claims were rejected or only partly paid for reasons they consider invalid. [news, 2026-03-07](https://www.localcircles.com/a/press/page/health-insurance-claim-survey#1)
- Half of Indian patients filing cashless claims waited 6 to 48 hours for approval before hospital discharge, far beyond regulator norms. [news, 2026-03-07](https://www.localcircles.com/a/press/page/health-insurance-claim-survey#2)

**Why now:** IRDAI tightened cashless timelines in 2024, giving policyholders deadlines to hold insurers to.

pain 5 · frequency 3 · willingness 4 · buildability 3 · learning 5 · novelty 3 · openness 4

</details>

### P111 · Home workouts stop the day the coach leaves

Remote exercise programmes assume young, confident clients who follow a video library alone. Older clients get confused, demo videos do not fit their bodies, and once sessions end most people quietly stop their home exercises, so coaches cannot see what was done against what was prescribed.

**Challenge:** Show a coach which clients actually did this week's exercises, and how well, without a single extra call.

Legendary · for creators · global · teaches Vision, Mobile apps, Voice AI

<details><summary>Evidence (6) and scores (26)</summary>

- Patients resent recurring physiotherapy visits and tend to stop their home exercises once sessions end, undermining recovery. [hn, 2026-09-25](https://news.ycombinator.com/item?id=49843673)
- Wellness coach cannot easily compare what a client was prescribed against what they actually completed in each workout. [capterra, 2026-09-21](https://capterra.com/p/202837/Everfit/reviews/#6)
- Paid fitness coaches only forwarded YouTube videos with no real motivation or follow-up, and the user regained the weight. [other, 2026-07-28](https://www.trustpilot.com/review/healthifyme.com#3)
- Fitness coaching business owner finds exercise demo videos outdated, wearable integrations missing and account support slow. [capterra, 2026-04-09](https://www.capterra.com/p/140262/Trainerize/reviews/#1)
- Personal trainer says older clients find the coaching app confusing, so onboarding them to remote programs takes extra effort. [capterra, 2025-12-08](https://www.capterra.com/p/140262/Trainerize/reviews/#2)
- Coach for middle-aged women found exercise libraries skewed young, forcing her to film many custom exercises herself. [capterra, 2024-04-10](https://capterra.com/p/141155/PT-Distinction/reviews/#2)

**Why now:** On-device pose estimation now runs well on ordinary Android phones, so form and reps can be checked without hardware.

pain 3 · frequency 4 · willingness 3 · buildability 3 · learning 5 · novelty 4 · openness 4

</details>

### P123 · Clinics pay lakhs for listings that bring one patient

Indian doctors pay booking marketplaces tens of thousands to lakhs a year for visibility and receive a handful of leads or none. Terms change without notice, ads stop running, and support vanishes after the sale, while the middlemen take a growing share of what patients pay.

**Challenge:** Show a small clinic exactly which rupee of its marketing brought which patient.

Epic · for businesses · India · teaches Data and dashboards, Full-stack web, Automation and integrations · also Money

<details><summary>Evidence (7) and scores (26)</summary>

- Clinic paid about fifty thousand rupees for a listing plan promising thousands of impressions, got a fraction and zero patient inquiries. [other, 2026-09-09](https://www.trustpilot.com/review/practo.com#3)
- Clinic paid for a year of a doctor-listing subscription and received only one poor quality lead, now chasing a refund. [other, 2026-06-08](https://www.trustpilot.com/review/practo.com#7)
- Clinic owner says post-sale support vanished after buying a practice listing plan and unknown third-party integrations appeared on their profile. [other, 2026-06-04](https://www.trustpilot.com/review/practo.com#12)
- Doctor paid lakhs to a booking platform for patient visibility over a year and received just one patient, with no follow-up. [other, 2025-11-06](https://www.trustpilot.com/review/practo.com?page=2#1)
- Doctor spent several lakhs on platform ads over ten months, then ads stopped showing and unrequested services were added. [other, 2025-09-10](https://www.trustpilot.com/review/practo.com?page=2#3)
- Doctor says platform changed terms unilaterally, blocked free appointment booking and pushed a paid reach subscription. [other, 2025-07-10](https://www.trustpilot.com/review/practo.com?page=2#4)
- Much healthcare spending goes to middlemen rather than the people providing care, inflating costs for patients. [yc, 2024-02-14](https://www.ycombinator.com/rfs#summer-2024-eliminating-healthcare-middlemen)

**Why now:** Google Business Profiles and WhatsApp booking let clinics own patient acquisition directly, without paying a middleman.

pain 4 · frequency 3 · willingness 5 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P135 · Therapists write reports in the hours they should rest

Therapists and clinic staff spend long unpaid hours on insurance justification reports, data entry and sending results. Administration from disconnected systems eats a large share of healthcare spending while staff are overworked and underpaid.

**Challenge:** Turn a therapist's session notes into a ready-to-send progress report in five minutes.

Epic · for businesses · global · teaches AI agents, Voice AI · also Work

<details><summary>Evidence (3) and scores (25)</summary>

- An autism services worker writes very long insurance justification reports every six months with little time allotted for them. [hn, 2026-09-02](https://news.ycombinator.com/item?id=49536437)
- Mid-sized Indian clinic staff spend about eleven hours weekly on manual confirmation calls, paper-to-records entry, sending lab results and billing reconciliation. [other, 2026-05-02](https://www.webmarv.com/blogs/clinic-staff-automation-gap)
- Clinic staff are overworked and underpaid as owners and overheads take most of what they bill. [yc, 2024-02-14](https://www.ycombinator.com/rfs#summer-2024-mso-healthcare)

**Why now:** Ambient scribes proved the idea in 2025; allied-health and Indian practices are still largely unserved.

pain 4 · frequency 4 · willingness 4 · buildability 3 · learning 5 · novelty 2 · openness 3

</details>

### P146 · Solo coaches sell through six payment links

Independent fitness and diet coaches cannot show all their packages on one page, so each needs its own payment link, and clients cannot see availability to book. Every new feature moves into a paid add-on, and rescheduling a missed session means another round of calls.

**Challenge:** Let a solo coach sell any package, take payment and fill the calendar from one link they share.

Rare · for creators · India · teaches Payments, Full-stack web, Automation and integrations · also Money

<details><summary>Evidence (4) and scores (24)</summary>

- Online coach feels nickel-and-dimed as coaching software moves key features into paid add-ons, squeezing small coaching businesses. [capterra, 2026-07-22](https://capterra.com/p/202837/Everfit/reviews/#5)
- Online coach cannot show all paid program packages on one page; each package needs its own separate payment link. [capterra, 2026-07-21](https://capterra.com/p/202837/Everfit/reviews/#3)
- Personal trainer selling online coaching lacks a built-in booking view where clients can see availability and schedule sessions. [capterra, 2026-07-20](https://capterra.com/p/202837/Everfit/reviews/#1)
- Dietician and coach were hard to reach, calls hard to follow, and rescheduling missed sessions was tedious. [other, 2026-06-01](https://www.trustpilot.com/review/healthifyme.com#4)

**Why now:** UPI payment links and recurring mandates became cheap for individuals, and Indian coaches moved selling onto social media.

pain 3 · frequency 4 · willingness 4 · buildability 5 · learning 3 · novelty 2 · openness 3

</details>

### P157 · The same strip of tablets costs half next door

The same prescription can cost 30 to 50 percent more at one pharmacy than another, and patients cannot compare. Online orders are approved and then cancelled days later because the partner shop never had the stock, leaving patients without medicine.

**Challenge:** Tell a patient where their prescription is in stock today, nearby, and at the lowest price.

Epic · for consumers · India · teaches Data and dashboards, Full-stack web, Mobile apps · also Retail

<details><summary>Evidence (4) and scores (24)</summary>

- Medicine order status promised delivery every day for days but it never arrived and logistics ignored address issues. [other, 2026-10-02](https://www.trustpilot.com/review/pharmeasy.in#3)
- Medicine order cancelled 25 days after placing it, leaving the patient without medicines and no responsive support. [other, 2026-09-27](https://www.trustpilot.com/review/pharmeasy.in#4)
- The same prescription medicine can cost 30 to 50 percent more at one pharmacy chain than another, and patients cannot compare. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ZS8IdZWYn)
- Online medicine order was approved, then cancelled five days later because the partner retailer did not have the item. [other, 2025-10-15](https://www.trustpilot.com/review/pharmeasy.in#1)

**Why now:** Generic medicine stores have spread across India, and chemists now run on billing software that could share stock.

pain 4 · frequency 5 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P167 · Fitness plans easy to buy, impossible to cancel

Diet and fitness programmes are sold through limited-time offers and sales promises, then refuse refunds, hide deadlines in the terms and keep billing after cancellation. Members and even trainers report being charged months after they tried to leave.

**Challenge:** Make cancelling a fitness or diet subscription take one minute and leave a record the seller cannot dispute.

Epic · for consumers · India · teaches Payments, Automation and integrations, AI agents · also Money

<details><summary>Evidence (5) and scores (23)</summary>

- Studio member describes hidden terms and forced recurring subscription billing with aggressive collections from booking platform. [other, 2026-09-28](https://www.trustpilot.com/review/mindbodyonline.com#2)
- Sales rep promised a refund window for a coaching plan, but the company later refused the refund outright. [other, 2026-09-25](https://www.trustpilot.com/review/healthifyme.com#1)
- Weight-loss subscriber lost money due to unclear refund terms and hidden deadlines buried in the plan conditions. [other, 2026-09-10](https://www.trustpilot.com/review/healthifyme.com#2)
- Pushed into paying via a limited-time offer for a weight-loss program, then met with silence and no cancellation. [other, 2026-04-15](https://www.trustpilot.com/review/healthifyme.com#6)
- Trainer kept getting billed by a coaching platform across three cancellation attempts, even rebilled four months later. [capterra, 2025-05-01](https://capterra.com/p/202837/Everfit/reviews/#2)

**Why now:** India's 2023 dark-pattern guidelines and the 2025 push for self-audits give consumers a rule to point to, and UPI AutoPay made recurring charges easy to start.

pain 3 · frequency 3 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P177 · Small gyms lose money between card and payout

Small gyms pay monthly software fees plus card charges, then wait on erratic payouts of their own members' fees. Billing systems lock loyal members out the instant a payment fails and double-charge others, while coaches still have to be paid by hand outside the system.

**Challenge:** Show a small gym owner every rupee a member paid, when it lands, and who is owed what, in one view.

Epic · for businesses · global · teaches Payments, Data and dashboards, Automation and integrations · also Money

<details><summary>Evidence (5) and scores (23)</summary>

- Small gym affiliate finds monthly software fees plus card processing charges too expensive for its size. [capterra, 2026-09-20](https://www.capterra.com/p/159663/Wodify/reviews/#1)
- Duplicate charge from a payment glitch was only partly refunded, leaving the member out of pocket. [other, 2026-08-07](https://www.trustpilot.com/review/cult.fit#5)
- Gym owner says the system blocks member access instantly after a missed payment with no grace period, upsetting loyal members. [capterra, 2026-04-23](https://www.capterra.com/p/136861/Glofox/reviews/#1)
- Gym owner cannot pay coaches through the gym platform and finds merchandise point of sale weak, so payroll is separate. [capterra, 2025-08-14](https://www.capterra.com/p/159663/Wodify/reviews/#3)
- Gym owner lost trust in member billing software after delayed or erratic payouts of collected membership fees. [capterra, 2025-03-11](https://www.capterra.com/p/159663/Wodify/reviews/#2)

**Why now:** Cheaper UPI collection in India and open payment APIs make it possible for a tiny gym to skip card fees entirely.

pain 4 · frequency 4 · willingness 4 · buildability 3 · learning 3 · novelty 2 · openness 3

</details>

### P186 · Wellness studios trapped in software that stopped listening

Small studios and solo therapists wait months for fixes, get pushed through chatbots before any human help, and absorb new fees added without notice. Leaving feels impossible because every client, package and booking lives inside the system.

**Challenge:** Let a small practice move every client, package and booking to new software in one afternoon.

Legendary · for businesses · global · teaches Automation and integrations, AI agents, Data and dashboards · also Work

<details><summary>Evidence (4) and scores (23)</summary>

- Solo therapist hit with a new per-claim fee without notice while long-used claim review features were removed. [other, 2026-09-18](https://www.trustpilot.com/review/simplepractice.com#1)
- Private practice therapist must go through an AI chatbot for all support, with barely any phone help for urgent issues. [other, 2026-08-10](https://www.trustpilot.com/review/simplepractice.com#2)
- Fitness business CEO frustrated that gym software support pushes owners through AI bots before any human help. [capterra, 2026-02-06](https://www.capterra.com/p/136861/Glofox/reviews/#3)
- Wellness practitioner waited six months for a scheduling fix after poor onboarding, with support in a distant time zone. [capterra, 2025-02-12](https://www.capterra.com/p/136861/Glofox/reviews/#2)

**Why now:** Language models can now map messy CSV exports to a new schema with little hand-written code.

pain 3 · frequency 2 · willingness 3 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P194 · Studios reconcile three systems by hand every month

Studios and clinics run bookings, corporate aggregator visits, invoices and accounting in separate systems that barely talk. Owners reconcile visits and recurring packages by hand, and administration eats a large share of what they bill.

**Challenge:** Turn a month of bookings, aggregator visits and invoices into one reconciled ledger without a spreadsheet.

Epic · for businesses · global · teaches Data and dashboards, Automation and integrations, Payments · also Money

<details><summary>Evidence (5) and scores (23)</summary>

- Sports facility owner says integration with corporate fitness aggregator is incomplete, forcing manual reconciliation of visits. [capterra, 2026-05-05](https://www.capterra.com/p/136861/Glofox/reviews/#5)
- Studio director cannot connect class bookings to aggregator memberships and finds publishing events awkward. [capterra, 2026-04-01](https://www.capterra.com/p/136861/Glofox/reviews/#4)
- Therapy clinic administrator finds financial reports too shallow and accounting integration limited, so reconciliations are manual. [capterra, 2025-06-12](https://www.capterra.com/p/180878/Cliniko/reviews/#2)
- Roughly a third of healthcare spending goes to administration created by disconnected systems and paperwork. [yc, 2025-05-08](https://www.ycombinator.com/rfs#summer-2025-healthcare-ai)
- Allied health clinic director wants recurring invoices and membership packages, which practice software does not support. [capterra, 2025-02-10](https://www.capterra.com/p/180878/Cliniko/reviews/#1)

**Why now:** Corporate fitness aggregators grew fast in 2025, adding a third revenue stream small studios must match by hand.

pain 3 · frequency 3 · willingness 4 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P202 · Small-city patients pay for specialists, get two minutes

Patients in smaller cities wait weeks for specialists, so they pay for online consults that get swapped to a different doctor, downgraded to audio, cut to two minutes or cancelled without refund. They lose the fee and still have no plan.

**Challenge:** Make sure a patient who pays for a specialist consult gets that specialist, that time, or their money back.

Epic · for consumers · India · teaches AI agents, Automation and integrations, Payments

<details><summary>Evidence (5) and scores (22)</summary>

- Teleconsult booked for a specific doctor by video was instead handled by a different doctor over an audio call. [other, 2026-10-05](https://www.trustpilot.com/review/practo.com#1)
- Online consultation auto-cancelled with each side blaming the other, payment never refunded and no reachable support. [other, 2026-09-30](https://www.trustpilot.com/review/practo.com#2)
- Patients in smaller cities wait weeks for specialists or must travel to metros because so few practise locally. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#hDY2QiAl2)
- Instant online consult charged roughly three times the doctor own direct fee for a very brief, low quality consultation. [other, 2026-01-01](https://www.trustpilot.com/review/practo.com#9)
- Patient paid for an online booked consult that lasted two minutes with no diagnosis or advice given. [other, 2025-09-26](https://www.trustpilot.com/review/practo.com?page=2#6)

**Why now:** Teleconsults became normal after 2020, and complaints about quality and refunds rose with them.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P210 · A blood test should not cost a day

Rural patients travel tens of kilometres and lose a day for a basic test, and women in conservative areas delay tests over privacy and transport. Home packages booked online arrive missing tests, results are delayed, and refunds stall.

**Challenge:** Get a basic blood test done and the report into the patient's hand within a day, wherever they live.

Epic · for consumers · India · teaches Full-stack web, Mobile apps, Data and dashboards

<details><summary>Evidence (4) and scores (22)</summary>

- Lab test results booked through a pharmacy app were repeatedly delayed with excuses. [other, 2026-09-21](https://www.trustpilot.com/review/pharmeasy.in#5)
- Lab test package arrived missing promised tests and the refund stayed unprocessed despite daily follow-ups with customer care. [other, 2026-05-03](https://www.trustpilot.com/review/practo.com#11)
- Rural patients travel tens of kilometres and lose a whole day just to get a basic blood test or scan. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#i6T5DKxT9)
- Women in conservative areas delay diagnostic tests because facilities and transport lack privacy and women-friendly support. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#SsABaJwJm)

**Why now:** Home sample collection expanded beyond metros in 2024 and 2025, but coverage and reliability are patchy.

pain 4 · frequency 3 · willingness 4 · buildability 3 · learning 2 · novelty 3 · openness 3

</details>

## Education and careers

### P008 · Take-home work no longer proves who did it

Instructors find take-home coding work and even recorded oral exams can now be done or gamed with AI, so they shift grades to in-class exams. Teaching methods have barely changed in decades, and honest assessment now needs live, in-person checks that do not scale. Teachers spend more time policing and less time teaching.

**Challenge:** Let a teacher check, in five minutes per student, that a submitted assignment is really understood.

Epic · for businesses · global · teaches Voice AI, AI agents

<details><summary>Evidence (3) and scores (27)</summary>

- Educator finds even recorded take-home oral exams can be gamed with AI, so honest assessment now needs live in-person checks. [hn, 2026-01-02](https://news.ycombinator.com/item?id=46469245)
- Programming instructor must shift most of the grade to in-class exams because take-home coding work is now easily done by AI. [hn, 2025-07-16](https://news.ycombinator.com/item?id=44587768)
- Teaching methods have barely changed in decades despite a huge education sector and over a billion students. [yc, 2025-05-08](https://www.ycombinator.com/rfs#summer-2025-future-of-education)

**Why now:** AI made take-home work unprovable during 2025, and voice agents can now run a short spoken check on what a student submitted.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 5 · novelty 4 · openness 4

</details>

### P020 · The sales call promised it, the course denied it

Edtech sales staff promise deferrals, content and mentoring on calls, then the company denies it after payment and refuses to check the recording. Parents and students are pressured into upgrades, told their existing course is worthless, and spammed from many numbers after signing up. Complaints about coaching to the consumer helpline tripled in a year.

**Challenge:** Make every promise on an edtech sales call show up in writing before the buyer pays.

Legendary · for consumers · India · teaches Voice AI, AI agents

<details><summary>Evidence (7) and scores (26)</summary>

- Enrollment counsellor verbally promised a deferral option that the company later denied, refusing to check the sales call recording. [other, 2026-09-10](https://www.trustpilot.com/review/upgrad.com#2)
- Parent says counsellors and mentors sold hard but then barely engaged with the child after enrolment. [other, 2026-08-25](https://www.trustpilot.com/review/vedantu.com#2)
- Sales executive pressured a student to upgrade by calling their cheaper existing course worthless, with no refund on the first purchase. [other, 2026-05-25](https://www.trustpilot.com/review/pw.live#4)
- Student keeps getting persistent sales spam calls from many different numbers after signing up on a test-prep platform. [other, 2026-01-09](https://www.trustpilot.com/review/unacademy.com#1)
- Course sold as board-exam style teaching did not match what was actually taught, leaving the student misled about content. [other, 2025-07-10](https://www.trustpilot.com/review/unacademy.com#3)
- Parent pushed by aggressive edtech sales staff whose promises about the course did not match what was delivered after paying. [other, 2025-05-22](https://www.trustpilot.com/review/byjus.com#1)
- Coaching aspirant complaints to the consumer helpline tripled in a year, mostly over enrolment fees not refunded, poor teaching and abrupt course cancellations. [news, 2024-09-22](https://news.careers360.com/over-656-upsc-ias-iit-jee-neet-ca-mba-cat-entrance-exams-aspirants-refunded-rs-1-crore-coaching-institutes-consumers-affairs)

**Why now:** Coaching complaints to the National Consumer Helpline tripled, and on-device call transcription became good and cheap in 2025.

pain 4 · frequency 3 · willingness 2 · buildability 4 · learning 5 · novelty 4 · openness 4

</details>

### P032 · Half of job seekers cannot spot a fake recruiter

Most Indian job seekers have met fraudulent job offers, and half cannot tell a genuine recruiter from a scammer, with the youngest hit hardest. Fake postings sit on major internship boards with no visible employer check, and fear of scams now makes young candidates ignore real opportunities. People lose registration fees and months of search time.

**Challenge:** Tell a first-time job seeker within seconds whether an offer, recruiter or posting is real.

Epic · for consumers · India · teaches AI agents, Data and dashboards, Mobile apps · also Work

<details><summary>Evidence (4) and scores (25)</summary>

- Applicant sent many internship applications that were never responded to, with listings that appeared unverified or inactive. [other, 2026-09-22](https://www.trustpilot.com/review/internshala.com#5)
- Job seeker found fraudulent job postings on a major Indian internship platform with no visible verification of employers. [other, 2026-08-14](https://www.trustpilot.com/review/internshala.com#1)
- Survey finds 93 percent of Indian job seekers met fraudulent offers and half cannot tell genuine recruiters from scammers; Gen Z hit hardest. [news, 2026-07-09](https://www.storyboard18.com/how-it-works/recruitment-scams-widespread-in-india-eroding-trust-ws-l-103685.htm)
- Fear of job scams makes most Indian job seekers ignore real opportunities, with many young candidates losing money to fake recruiters. [news, 2026-07-09](https://www.business-standard.com/industry/news/job-scam-fears-prompt-75-of-indians-to-ignore-work-opportunities-indeed-report-126070900929_1.html)

**Why now:** A 2026 survey found most Indian job seekers had met fake offers, and cheap language models now make both convincing scams and fast checks possible.

pain 4 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P044 · Good marks, and still cannot debug code

Employers find fresh graduates with good marks who cannot debug code or apply concepts, because colleges teach mostly theory. Most students think they are work-ready while few employers agree, and graduates at campuses with few visiting recruiters are far less likely to be hired. Firms want ready hires but avoid paying to train them.

**Challenge:** Let a graduate from a small college prove one real skill to an employer in a single afternoon.

Legendary · for consumers · India · teaches AI agents, Full-stack web · also Work

<details><summary>Evidence (3) and scores (25)</summary>

- Most Indian students think they are work-ready but few employers agree; firms want plug-and-play graduates yet avoid paying to train them. [news, 2026-09-14](https://www.policycircle.org/opinion/graduate-unemployment-in-india/)
- Most engineering and MBA graduates of 2026 remain unplaced; students at campuses with few visiting recruiters are far less likely to get hired. [news, 2026-04-28](https://www.business-standard.com/finance/personal-finance/degrees-lose-edge-39-engineers-earn-below-7-lpa-30-mbas-under-10-lpa-126042800596_1.html)
- Employers find fresh graduates with good marks still cannot debug code or apply concepts because colleges teach mostly theory. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#XF2tVQvVN)

**Why now:** 2026 placement data showed most engineering and MBA graduates unplaced, and AI review now makes grading real work samples cheap.

pain 5 · frequency 4 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P056 · Paid for the course, then the company went quiet

Learners pay for courses, books, certificates and reservation fees, and then the materials never arrive, the certificate stays locked, the classes freeze before exams or the company stops answering. Money-back guarantees are denied by citing terms the buyer never clearly saw. Recovering the money means weeks of unanswered tickets, so most people give up.

**Challenge:** Get a stranded learner their money back, or a written answer, within two weeks of the first complaint.

Epic · for consumers · India · teaches AI agents, Automation and integrations · also Homes

<details><summary>Evidence (7) and scores (25)</summary>

- Learner watched every video lesson but the completion certificate stayed locked, with no clear way to get it released. [other, 2026-10-05](https://www.trustpilot.com/review/simplilearn.com#1)
- Coaching app froze on its loading screen right before exams, locking a student out of the classes they had paid for. [other, 2026-09-02](https://www.trustpilot.com/review/pw.live#1)
- Online degree provider took a 10000 rupee reservation fee before checking eligibility documents, then rejected the applicant and kept the fee. [other, 2026-08-25](https://www.trustpilot.com/review/upgrad.com#3)
- Commerce student paid 5000 rupees for professional exam registration help but materials never arrived and refund was refused. [other, 2026-08-15](https://www.trustpilot.com/review/testbook.com#3)
- Aspirant bought a UPSC course bundle but the printed books never arrived and customer care never answered follow-ups. [other, 2026-05-02](https://www.trustpilot.com/review/pw.live#3)
- Money-back guarantee on a rental plan denied by citing unclear terms the buyer never saw clearly. [forum, 2026-04-27](https://www.consumercomplaints.in/nobroker-moneyback-guarantee-scheme-c3541205)
- Customer lost a large sum on an edtech subscription and found no way to recover money once the company stopped delivering. [other, 2025-09-15](https://www.trustpilot.com/review/byjus.com#3)

**Why now:** India's e-Daakhil consumer filing and grievance-officer rules give a clear path, and agents can now draft and chase complaints for a fraction of a lawyer.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P068 · A patient AI tutor parents can actually trust

Parents want to give young children an encyclopedia or AI assistant for self-directed learning but have no child-safe controls over what it says. They also struggle to explain what AI is and where it fails in a way children understand. Meanwhile one-on-one tutoring that adapts to each child stays reserved for the few.

**Challenge:** Give a seven-year-old a patient voice tutor whose answers a parent can set limits on and review.

Epic · for consumers · global · teaches Voice AI, AI agents

<details><summary>Evidence (3) and scores (25)</summary>

- One-on-one tutoring that adapts to each young child is reserved for the few; most kids learn reading and arithmetic without patient personal help. [yc, 2026-07-22](https://www.ycombinator.com/rfs#fall-2026-the-primer)
- Parents struggle to explain what AI is, where it fails and its risks to children in an age-appropriate way. [hn, 2025-06-14](https://news.ycombinator.com/item?id=44276552)
- Parents want to give children an encyclopedia or AI assistant for self-directed learning but lack child-safe controls over it. [hn, 2025-05-20](https://news.ycombinator.com/item?id=44036653)

**Why now:** Voice models became fast and cheap enough in 2025 for a real-time tutor, and parental worry about AI for children is now mainstream.

pain 3 · frequency 4 · willingness 4 · buildability 3 · learning 5 · novelty 3 · openness 3

</details>

### P080 · A hundred applications, seven replies, no feedback

Graduates send dozens to hundreds of applications and hear back from a handful, filtered out by keyword screens, ghost listings and a flood of machine-written applications. Candidates lose track of where they applied, submit twice and miss follow-ups. Qualified people stay unemployed without ever learning why they were rejected.

**Challenge:** Turn a graduate's next fifty applications into twenty targeted ones that each get a response.

Rare · for consumers · global · teaches AI agents, Automation and integrations, Full-stack web · also Work

<details><summary>Evidence (5) and scores (24)</summary>

- New graduates send dozens of applications and hear almost nothing back in a weak junior job market. [hn, 2026-03-10](https://news.ycombinator.com/item?id=47329678)
- Candidate got interviews from only 7 of 100 applications, blaming ghost job listings and keyword-filtering applicant tracking systems. [hn, 2026-03-06](https://news.ycombinator.com/item?id=47279601)
- Job boards are flooded with AI-generated applications and companies ghost candidates after long multi-round interview processes. [hn, 2026-01-28](https://news.ycombinator.com/item?id=46796333)
- Qualified freshers get no callbacks because automated resume filters reject them for missing keywords or brand names. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#Afs3WS8YG)
- Job seeker struggles to track many applications across different platforms, leading to missed follow-ups and accidental duplicate submissions. [hn, 2025-12-21](https://news.ycombinator.com/item?id=46346851)

**Why now:** Machine-written applications flooded job boards in 2025 and 2026, so screening got stricter and the junior market tightened at once.

pain 4 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 2

</details>

### P092 · Three lakh rupees of upskilling, zero interviews

Learners pay lakhs of rupees for tech and data upskilling programs sold with placement guarantees, then finish with weak teaching, unusable lab environments and no interviews. College placement training polishes resumes that recruiters ignore, and some premium course content reads as machine-generated filler. The cost is debt, a lost year and a skill gap still open.

**Challenge:** Show a learner, before they pay, what past graduates of a course actually went on to do.

Legendary · for consumers · India · teaches Data and dashboards, Full-stack web · also Work

<details><summary>Evidence (6) and scores (24)</summary>

- Learner says the hands-on lab environment bundled with paid courses has been nearly unusable for over a year. [other, 2026-09-10](https://www.trustpilot.com/review/udemy.com#3)
- Learner paid about 2.5 lakh rupees for a data analyst program, found teaching weak, and got zero interviews three months after finishing. [other, 2026-09-01](https://www.trustpilot.com/review/upgrad.com#1)
- AI and ML course content felt generic and shallow, as if machine-generated, not worth a premium price. [other, 2026-04-15](https://www.trustpilot.com/review/scaler.com#3)
- After 1.6 years and 3 lakh rupees in a tech upskilling program, learner remains unplaced with few interviews and unhelpful career support. [other, 2026-03-30](https://www.trustpilot.com/review/scaler.com#1)
- Student finished a course marketed with guaranteed placement but never received the promised job and support went silent. [other, 2026-03-12](https://www.trustpilot.com/review/internshala.com#4)
- Engineering colleges sell placement training that recruiters ignore because it polishes resumes rather than building real skills. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ijKfSf7Im)

**Why now:** Indian upskilling firms sold placement guarantees hard into a 2025 and 2026 hiring slowdown, and complaints about unplaced graduates are now everywhere.

pain 5 · frequency 3 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 4

</details>

### P104 · College advice paid for by the colleges

School leavers in India get college advice from counsellors who earn referral commissions, steering them toward costly private colleges. Young people leaving formal education lack mentors and structure, and teenagers who can already code cannot find paid internships to test a direction. A wrong choice at eighteen costs years and lakhs of rupees.

**Challenge:** Give a school leaver advice on what to study next that no college has paid to influence.

Epic · for consumers · India · teaches AI agents, Voice AI · also Work

<details><summary>Evidence (3) and scores (24)</summary>

- School leavers receive college advice from counsellors earning referral commissions, steering them toward costly private colleges. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#p4NFGc_hn)
- Young people leaving formal education lack structure, mentors and clear guidance on careers. [fixmyitch, 2026-01](https://razorpay.com/m/fix-my-itch/#highlight-do-people-leaving-formal-education-l)
- Teenagers who can already code find paid internships nearly impossible to locate or qualify for. [hn, 2025-07-29](https://news.ycombinator.com/item?id=44717966)

**Why now:** Admission season in 2025 and 2026 saw referral-driven counselling grow, while voice models now make free, regional-language guidance possible.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P116 · A year of exam prep, paid upfront

Exam-prep courses demand non-refundable yearly fees upfront, with no way to pay per topic or try first. Buyers find advertised content later locked behind a pricier tier, are pushed into instalment plans with threats about credit scores, and cannot move a paid batch when they switch streams. Students on tight budgets pay for a year they may never use.

**Challenge:** Let an exam aspirant pay only for the topics and weeks they actually use.

Epic · for consumers · India · teaches Payments, Full-stack web · also Money

<details><summary>Evidence (4) and scores (24)</summary>

- Student who switched stream from science to commerce could neither move their paid batch to the new stream nor get a refund. [other, 2026-06-13](https://www.trustpilot.com/review/pw.live#2)
- Exam aspirant pushed into a mandatory instalment plan for a prep course, then threatened about credit score damage over payments. [other, 2026-03-18](https://www.trustpilot.com/review/testbook.com#1)
- Test-prep subscriber found advertised courses locked behind a newer, pricier tier after buying the pass. [other, 2026-02-14](https://www.trustpilot.com/review/testbook.com#2)
- Exam-prep platforms demand non-refundable yearly fees upfront, with no way to pay per topic or try first. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#CS77iyaK_)

**Why now:** UPI AutoPay and small-ticket payments became routine in 2025, making per-topic pricing practical where yearly passes once were the only option.

pain 4 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P128 · Parents pay the tutor and cannot see the learning

Parents pay for tutoring and online classes and see no visible progress, while tutors who just solve homework leave children weak in fundamentals. Independent tutors have no simple way to keep attendance, notes and lesson plans in one place or to share a progress report with parents. Without proof of learning, good tutors lose students and weak ones keep charging.

**Challenge:** Let an independent tutor send every parent a weekly progress note in five minutes flat.

Epic · for creators · global · teaches Voice AI, AI agents, Mobile apps · also Creators

<details><summary>Evidence (5) and scores (24)</summary>

- Parent paid for online coding and maths classes but saw connectivity problems, poor tech support and no visible learning progress. [other, 2026-09-14](https://www.trustpilot.com/review/vedantu.com#1)
- Tutoring business owner lacks a place to store and share parent-facing progress reports or report cards per student. [capterra, 2026-06-22](https://www.capterra.com/p/181623/TutorBird/reviews/#2)
- Parents pay tutors who simply solve homework, so children stay weak in fundamentals and never learn to reason through problems. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#PhsNoiqVE)
- Tutoring coordinator cannot switch easily between attendance, notes and lesson plans, and has no history of schedule edits. [capterra, 2025-04-22](https://www.capterra.com/p/181623/TutorBird/reviews/#4)
- Family paid for live tutoring but teachers repeatedly failed to show up and the company refused any refund for missed classes. [other, 2025-02-18](https://www.trustpilot.com/review/byjus.com#2)

**Why now:** Voice-to-text in Indian languages became reliable in 2025, so a tutor can speak a report instead of typing it.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P140 · Stuck on one problem with no one to ask

Coaching students say only a few learners ever get live doubt sessions despite repeated requests, and offline centres teach unevenly and favour some students. Outside paid tutors or office hours, a student stuck on a textbook problem has nowhere to turn. Unanswered doubts pile up into the gaps that sink an exam.

**Challenge:** Get a stuck student from a photo of the problem to understanding it, without handing them the answer.

Rare · for consumers · India · teaches Vision, AI agents

<details><summary>Evidence (3) and scores (24)</summary>

- Online coaching student says only a few learners ever get live video doubt sessions with teachers despite repeated chat requests. [appstore, 2026-06-03](https://apps.apple.com/in/app/physics-wallah/id1641443555?see-all=reviews#1)
- Students stuck on a textbook problem have little help available outside paid tutors or office hours. [hn, 2025-08-26](https://news.ycombinator.com/item?id=45033296)
- Offline coaching centre students report poorly structured teaching and teachers treating students unequally. [appstore, 2025-07-07](https://apps.apple.com/in/app/physics-wallah/id1641443555?see-all=reviews#3)

**Why now:** Vision models in 2025 began reading handwritten maths reliably, so a hint-first tutor no longer needs a human on call.

pain 3 · frequency 5 · willingness 3 · buildability 4 · learning 5 · novelty 2 · openness 2

</details>

### P151 · The best courses are only in English

Bright students outside big cities miss top online courses because most are available only in English. Learners of less common languages cannot find beginner-level reading material, and flashcards repeat the same sentences instead of fresh audio examples. Good teaching exists, but not in the language the learner thinks in.

**Challenge:** Turn one strong English course into one a Hindi- or Tamil-first student can learn from just as well.

Epic · for consumers · global · teaches Voice AI, AI agents

<details><summary>Evidence (3) and scores (24)</summary>

- Language learners want audio-first flashcards with fresh example sentences instead of memorising the same ones. [hn, 2026-07-10](https://news.ycombinator.com/item?id=48864021)
- Bright students outside big cities miss top online courses because most are only available in English. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#opmCwCilX)
- Learners of less common languages find beginner-level reading material almost impossible to source. [hn, 2025-05-08](https://news.ycombinator.com/item?id=43925345)

**Why now:** Indian-language speech models matured in 2025, making natural dubbing and graded reading material cheap to generate.

pain 3 · frequency 4 · willingness 2 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P161 · A course business the host can cut overnight

Course creators build years of income on teaching marketplaces and hosts that can change terms at will: one forced shift to subscription payouts cut earnings by over ninety percent, and another educator was terminated without notice. Long-time sellers leave over rising prices and weak support, and tutors want more control over their business than the software allows. The audience and income belong to the host, not the teacher.

**Challenge:** Let a course creator move their students, content and payments to a home they own in one weekend.

Epic · for creators · global · teaches Full-stack web, Payments · also Creators

<details><summary>Evidence (4) and scores (24)</summary>

- Course instructor says a forced shift to subscription-based payouts cut earnings from the marketplace by over 90 percent. [other, 2026-09-25](https://www.trustpilot.com/review/udemy.com#1)
- Creator leaving after seven years citing rising prices, weak software and no real support for an established course business. [other, 2026-08-15](https://www.trustpilot.com/review/teachable.com#3)
- Online educator was terminated by the edtech platform without notice or explanation, losing the teaching income built there. [other, 2025-07-01](https://www.trustpilot.com/review/unacademy.com#2)
- Independent tutor wants a prepaid lesson credit system and more control over business settings than scheduling software allows. [capterra, 2025-04-13](https://www.capterra.com/p/181623/TutorBird/reviews/#3)

**Why now:** Marketplace payout changes in 2025 and 2026 showed creators how fragile rented audiences are, and storefront building has become cheap.

pain 5 · frequency 2 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P171 · Six months of job-portal premium, a handful of calls

Indian job seekers pay for premium job-portal subscriptions that promise recruiter visibility, then get fewer calls than they did applying by hand. Experienced candidates find the same portals work only for freshers, and the listings they see repeat or do not match. The fee is small each month, but months of false hope cost far more.

**Challenge:** Show a job seeker, before they pay, how many real recruiter calls a profile like theirs actually gets.

Epic · for consumers · India · teaches Data and dashboards, Full-stack web · also Work

<details><summary>Evidence (3) and scores (23)</summary>

- Job seeker bought several paid job-portal subscriptions yet received no genuine interview calls, only irrelevant or repeated listings. [other, 2026-09-07](https://www.trustpilot.com/review/naukri.com#1)
- Experienced professional says the job portal works only for freshers, getting no interview calls despite an accurate updated profile. [other, 2026-07-30](https://www.trustpilot.com/review/naukri.com#3)
- Six-month paid job-portal subscriber got only a handful of recruiter calls, far fewer than from searching and applying manually. [appstore, 2026-02-18](https://apps.apple.com/in/app/naukri-job-search-and-news/id482877505?see-all=reviews#1)

**Why now:** Indian job portals pushed paid tiers harder in 2025 and 2026 while a weak junior market made callbacks scarcer, so seekers pay more for less.

pain 3 · frequency 4 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 4

</details>

### P181 · Paid resume help that returns a template

Job seekers in India pay for resume writing, job-lead add-ons and personal job experts, and receive generic content, emailed feeds of public listings or a relationship manager who disappears. Features that once helped freshers for free now sit behind paid tiers that do not deliver. Candidates lose money at the point they can least afford it.

**Challenge:** Give a fresher the resume and job-lead help they were sold, for a fraction of the price, and show it worked.

Rare · for consumers · India · teaches AI agents, Full-stack web · also Work

<details><summary>Evidence (3) and scores (23)</summary>

- Paid personalised job-expert service never delivered the promised one-to-one help; relationship manager vanished after payment. [other, 2026-09-08](https://www.trustpilot.com/review/naukri.com#2)
- Job seekers feel a once fresher-friendly job app now locks useful features behind a paid tier that does not deliver. [appstore, 2026-03-10](https://apps.apple.com/in/app/naukri-job-search-and-news/id482877505?see-all=reviews#2)
- Paid resume-writing service returned generic content, and a paid job-leads add-on only sent email feeds of public listings. [appstore, 2025-10-07](https://apps.apple.com/in/app/naukri-job-search-and-news/id482877505?see-all=reviews#3)

**Why now:** Language models made a tailored resume nearly free to produce in 2025, which exposes services still charging thousands for templates.

pain 3 · frequency 3 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P190 · An accountant job post that attracts mechanics

Small Indian employers pay a few thousand rupees per job post and receive a trickle of mismatched, duplicate or inactive applicants, sometimes a mechanic for an accountant role. Three-month plans end with no hire, and the premium portal often does worse than a cheaper one. Every week a role stays open costs a small firm real output.

**Challenge:** Get a small business three qualified candidates for a role within a week, without another paid job post.

Epic · for businesses · India · teaches AI agents, Data and dashboards, Automation and integrations · also Work

<details><summary>Evidence (4) and scores (23)</summary>

- Company paid to post jobs on a portal but got low-quality, mismatched applications and slow support when it raised the issue. [other, 2026-09-18](https://www.trustpilot.com/review/naukri.com#5)
- Small business paid about 3000 rupees for a job post and got 11 mismatched applicants, such as a mechanic for an accountant role. [other, 2026-07-29](https://www.trustpilot.com/review/apna.co#1)
- Employer on a three-month hiring plan received duplicate and inactive candidate profiles and made no hires at all. [other, 2026-06-05](https://www.trustpilot.com/review/apna.co#2)
- Recruiter paid for a job-portal subscription but got far fewer applicants than on cheaper competing hiring apps. [appstore, 2025-01-06](https://apps.apple.com/in/app/naukri-recruiter/id1212200323?see-all=reviews#1)

**Why now:** Hiring portals have shifted to paid plans for small employers, while cheap language models can now screen and shortlist applicants for a few rupees each.

pain 4 · frequency 3 · willingness 4 · buildability 3 · learning 4 · novelty 2 · openness 3

</details>

### P198 · Hours of lectures and podcasts, almost nothing retained

Learners take in hours of podcasts, books, articles and recorded lectures and forget most of it within days, despite highlighting and notes. Notes end up long and messy, backlogs of recorded classes pile up across subjects, and nothing brings back what was learned when it is needed. Time spent learning turns into very little knowledge kept.

**Challenge:** Make what someone heard or read this week come back to them at the moment it is useful.

Rare · for consumers · global · teaches Voice AI, AI agents, Mobile apps

<details><summary>Evidence (6) and scores (23)</summary>

- Student struggles to manage backlogs of recorded lectures across subjects in a confusing, glitchy coaching app. [appstore, 2026-08-26](https://apps.apple.com/in/app/physics-wallah/id1641443555?see-all=reviews#2)
- Podcast fans forget nearly everything from an episode within two days of hearing it. [hn, 2026-04-12](https://news.ycombinator.com/item?id=47737249)
- Students and workers write long messy notes that are hard to revise or understand when they need them. [hn, 2025-12-24](https://news.ycombinator.com/item?id=46373095)
- Avid nonfiction readers forget most of what they read despite highlighting and taking notes. [hn, 2025-07-19](https://news.ycombinator.com/item?id=44615032)
- Knowledge workers read dozens of articles and messages daily but have no reliable way to store and resurface what they learned. [hn, 2025-05-13](https://news.ycombinator.com/item?id=43976045)
- Podcast listeners absorb plenty of useful ideas but retain or act on almost none of them afterwards. [hn, 2025-02-02](https://news.ycombinator.com/item?id=42912891)

**Why now:** Cheap transcription of any podcast or lecture arrived in 2025, so what was heard can now be searched and quizzed like text.

pain 2 · frequency 5 · willingness 3 · buildability 4 · learning 5 · novelty 2 · openness 2

</details>

### P206 · Tutors earning well and still not knowing their profit

Independent tutors and course sellers enter payments by hand, cannot customise invoices to families, and keep profit and loss outside the software they pay for. Splitting income with partner tutors happens on spreadsheets, and per-learner and transaction fees quietly eat margins as the business grows. Busy teachers lose money they never notice leaving.

**Challenge:** Show an independent tutor what each student and each month actually earned them, after every fee.

Rare · for creators · global · teaches Payments, Data and dashboards, Automation and integrations · also Creators

<details><summary>Evidence (4) and scores (23)</summary>

- Long-time course creator says per-learner and transaction fees make the platform punishingly expensive as the course business grows. [other, 2026-08-30](https://www.trustpilot.com/review/teachable.com#1)
- Tutoring business owner cannot see profit and loss reports in the scheduling and billing tool, so finances are tracked elsewhere. [capterra, 2025-02-05](https://www.capterra.com/p/181623/TutorBird/reviews/?page=2#1)
- Independent tutor must enter payments manually and cannot customise invoices sent to families. [capterra, 2024-12-30](https://www.capterra.com/p/181623/TutorBird/reviews/?page=2#3)
- E-learning company running tutors cannot calculate tutor commissions or split profits with partners inside its management software. [capterra, 2024-12-02](https://www.capterra.com/p/181623/TutorBird/reviews/?page=2#2)

**Why now:** UPI made fee collection instant in India, but reconciling it with fees and splits is still manual for solo teachers.

pain 3 · frequency 4 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P214 · Hiring plans sold hard, then nobody answers

Recruiters buy hiring plans after aggressive sales calls promising guarantees, then face early plan expiry, money-back promises that are never honoured, verification stuck for weeks and support that stays silent. Access to candidate databases costs more every quarter with no alternative of similar reach. Small employers end up paying again just to keep hiring.

**Challenge:** Let a small employer see what each hiring channel delivered per rupee before renewing anything.

Epic · for businesses · India · teaches Data and dashboards, Automation and integrations · also Work

<details><summary>Evidence (6) and scores (22)</summary>

- Hiring app sales rep pushed hard for a paid plan with guarantees, then disappeared once the employer paid. [other, 2026-07-24](https://www.trustpilot.com/review/apna.co#4)
- Recruiter complains candidate-database access price keeps rising every quarter with no added benefit and no alternative of similar reach. [other, 2026-07-24](https://www.trustpilot.com/review/naukri.com#4)
- Small employer paid for a job posting but received poor-quality applicants and the advertised money-back guarantee was never honoured. [other, 2026-06-06](https://www.trustpilot.com/review/internshala.com#2)
- Employer stuck with KYC verification pending indefinitely on a hiring app, unable to post jobs and unable to reach any executive. [other, 2026-05-08](https://www.trustpilot.com/review/apna.co#3)
- Recruiter got only 14 applications against a promised 100 plus, and the paid plan expired early forcing another payment. [other, 2026-04-22](https://www.trustpilot.com/review/internshala.com#3)
- Recruiter got a wrong invoice type from a hiring platform and support stayed unresponsive for eight days. [appstore, 2026-03-05](https://apps.apple.com/in/app/naukri-recruiter/id1212200323?see-all=reviews#2)

**Why now:** Indian hiring portals raised prices and tightened plans in 2025 and 2026, and employers now spread spend across several channels with no view of which one works.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

## Work and teams

### P010 · Generated submissions bury every real applicant

Open calls now pull in hundreds of generated entries within hours: job posts drown in mass-produced applications, remote interviews are answered by chatbots, and a design contest can attract a thousand generated logos. Hiring managers give up on open hiring and fall back to referrals, which shuts out good people with no network.

**Challenge:** Let a small employer open a role to anyone and still find the ten genuine applicants by the end of day one.

Epic · for businesses · global · teaches AI agents, Voice AI, Data and dashboards

<details><summary>Evidence (3) and scores (26)</summary>

- Small business running a design contest got over a thousand AI-generated logo entries and could not get its prize money back. [other, 2026-10-05](https://www.trustpilot.com/review/www.freelancer.com#2)
- A hiring manager got hundreds of irrelevant generated applications within hours and abandoned open hiring for referrals. [hn, 2025-09-01](https://news.ycombinator.com/item?id=45091761)
- Interviewers report candidates quietly using AI chatbots to answer screening questions, making remote interviews hard to trust. [hn, 2025-01-14](https://news.ycombinator.com/item?id=42697863)

**Why now:** Auto-apply agents spread in 2025, so applications per role exploded while the share of genuine applicants fell.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P022 · Nobody remembers why it was built this way

Teams lose the reasoning behind past decisions, so new hires spend weeks digging through old tickets and commit history to learn why things are the way they are. Work inherited from departed colleagues arrives with no context or owner, and the meetings and customer conversations that held the answer were never captured.

**Challenge:** Let anyone ask why a past decision was made and get the reason, the people and the date in seconds.

Epic · for businesses · global · teaches AI agents, Voice AI, Data and dashboards

<details><summary>Evidence (4) and scores (26)</summary>

- Remote employee inherited tickets from departed colleagues with no context or owner, then got blamed for overruns on estimates they never made. [hn, 2026-08-19](https://news.ycombinator.com/item?id=49366543)
- Most companies lose the knowledge from meetings, tickets and customer conversations because nothing captures and learns from it. [yc, 2026-04-28](https://www.ycombinator.com/rfs#summer-2026-ai-operating-system-for-companies)
- Employees waste hours digging through old tickets and commit history to learn why past decisions were made, since nobody recorded the reasoning. [hn, 2026-03-31](https://news.ycombinator.com/item?id=47592464)
- Teams lose the reasons behind past decisions, so new hires spend weeks reconstructing why things were built that way. [hn, 2026-03-13](https://news.ycombinator.com/item?id=47368874)

**Why now:** Meeting transcription is now routine and cheap, so the raw material for decision memory finally exists if someone connects it.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 5 · novelty 4 · openness 4

</details>

### P034 · Small tweaks and AI hours that never get billed

Freelancers and small agencies leak margin through unbilled client tweaks, retainer hours nobody tracks, and time spent prompting and waiting on AI that no timesheet captures. Larger projects get underpriced at the start, and firms that pay in parts see freelancers disappear midway with money paid and work unfinished.

**Challenge:** Show a freelancer, every week, exactly which unbilled work is eating their margin and what to charge for it.

Epic · for creators · global · teaches Data and dashboards, Automation and integrations · also Creators

<details><summary>Evidence (5) and scores (25)</summary>

- Freelancers struggle to log billable time now that much of the work is prompting and waiting on AI agents. [hn, 2026-07-13](https://news.ycombinator.com/item?id=48890963)
- Freelancer saw profit eroded by many small unbilled client tweaks and had to build a calculator to see how much scope creep cost. [hn, 2026-07-08](https://news.ycombinator.com/item?id=48830015)
- Firms hiring freelancers informally see them vanish mid-project after a part payment, with no way to recover money or finish the work. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#oXevUMkW0)
- Solo freelance developers struggle to scope, price and deliver large projects beyond a few hundred hours. [hn, 2025-08-11](https://news.ycombinator.com/item?id=44866281)
- Agencies with many client retainers struggle to track hours used, remaining balances and renewals across different arrangements. [hn, 2025-05-07](https://news.ycombinator.com/item?id=43914597)

**Why now:** Agentic coding and design tools in 2025 and 2026 turned billable work into prompting and waiting, which old timers do not measure.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 3 · novelty 4 · openness 3

</details>

### P046 · Hundreds of applications, no callbacks, no reasons

Experienced people send hundreds of applications, sit through interviews round after round, and some stay unemployed for over a year without learning why their resume is ignored. They cannot see how automated filters read them, so they guess at length, format and how to explain a career break, and burn out guessing.

**Challenge:** Tell a job seeker, with evidence, why their applications are not converting and what single change to make next.

Epic · for consumers · global · teaches AI agents, Data and dashboards, Full-stack web · also Education

<details><summary>Evidence (6) and scores (25)</summary>

- Job seeker sent around 150 applications and got two interviews, with matching that ignores stated preferences. [other, 2026-10-01](https://www.trustpilot.com/review/www.indeed.com#3)
- Experienced professionals send many applications without callbacks and cannot tell why their resume is ignored. [hn, 2026-03-05](https://news.ycombinator.com/item?id=47267559)
- People returning after a career break struggle to explain the gap and get hired again. [hn, 2026-01-18](https://news.ycombinator.com/item?id=46667994)
- Some job seekers stay unemployed for over a year despite applying steadily the whole time. [hn, 2026-01-15](https://news.ycombinator.com/item?id=46634372)
- Job seekers sending hundreds of applications and sitting multi-round interviews burn out with no offer to show. [hn, 2025-08-01](https://news.ycombinator.com/item?id=44762796)
- Applicants cannot tell how automated hiring filters treat their resumes, so they guess at length and format. [hn, 2025-02-27](https://news.ycombinator.com/item?id=43196789)

**Why now:** Automated screening and auto-apply bots both spread in 2025, making the black box blacker and the advice that worked a few years ago useless.

pain 5 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P058 · Bought the HR software, still not live months later

Indian mid-size firms buy HR and payroll software on the strength of a demo, then find limits that were hidden, wait months for an implementation team that does not respond, and struggle to configure approvals and forms themselves. Staff end up hating software that cost a large share of the budget, and refunds promised during the sale never arrive.

**Challenge:** Get a 200-person firm live on new HR software in two weeks, with every approval flow tested before day one.

Legendary · for businesses · India · teaches AI agents, Automation and integrations, Full-stack web

<details><summary>Evidence (4) and scores (25)</summary>

- Operations head at a mining company found configuring permissions, forms and approval workflows in the HR tool hard and self-implementation slow. [capterra, 2026-06-19](https://www.capterra.com/p/110931/Zoho-People/reviews/#2)
- HR manager at a mid-size engineering firm says key HRMS limitations were hidden in the demo and a promised refund never arrived. [capterra, 2026-04-06](https://www.capterra.com/p/149253/Keka/reviews/#1)
- Company still not live on its HR software two and a half months after purchase, with an unresponsive implementation team and no manuals. [capterra, 2024-09-12](https://www.capterra.com/p/149253/Keka/reviews/#3)
- Growing companies find ERP software expensive, painful to implement and hated by the staff who use it. [yc, 2024-02-14](https://www.ycombinator.com/rfs#summer-2024-erp-software)

**Why now:** Agents that can read a policy document and configure workflows make implementation, not features, the place to compete in 2026.

pain 4 · frequency 2 · willingness 4 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P070 · HR software that only an admin can bend

HR systems are so complex to set up that staff wait ages before using them, routine workflows still need an admin to step in, and reports are unintuitive. Every role sees the same crowded screens, so workarounds pile up until the system creates more work than it saves.

**Challenge:** Let any manager change an HR workflow or pull a report by describing it in a sentence, without calling the admin.

Rare · for businesses · global · teaches AI agents, Data and dashboards, Full-stack web

<details><summary>Evidence (4) and scores (25)</summary>

- Retail HR manager trialling an HR system found setup so complex it takes ages to work through features before staff can use it. [capterra, 2026-09-05](https://www.capterra.com/p/110931/Zoho-People/reviews/#1)
- Business analyst says the enterprise HR platform needs so many workarounds that its complex workflows created more work instead of efficiency. [capterra, 2026-06-23](https://www.capterra.com/p/150606/Darwinbox-HR/reviews/#1)
- Recruiter at an Indian real estate firm finds HR reports unintuitive and routine workflows needing an admin to step in. [capterra, 2026-05-01](https://www.capterra.com/p/150606/Darwinbox-HR/reviews/#2)
- Every user sees the same software interface regardless of their role or habits, so most software fits nobody especially well. [yc, 2026-04-28](https://www.ycombinator.com/rfs#summer-2026-dynamic-software-interfaces)

**Why now:** Generating interfaces and reports on demand became practical in 2025, so software no longer has to show every role the same screens.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P082 · Broken integrations nobody notices for days

Payment and store notifications that never arrive, scheduled jobs that report success while doing nothing, backups that never covered a critical store, and form entries silently lost all fail without an alarm. One healthcare team keyed in leave for 61 staff by hand across three payroll cycles because a time clock sync had quietly broken.

**Challenge:** Tell a small team within an hour when any data that should have moved between their systems did not.

Epic · for businesses · global · teaches Automation and integrations, Data and dashboards, AI agents

<details><summary>Evidence (5) and scores (25)</summary>

- Healthcare HR director had to key in leave manually for 61 staff across three payroll cycles because the time clock to payroll sync broke. [capterra, 2026-04-20](https://www.capterra.com/p/153140/Connecteam/reviews/#1)
- Users silently lose long form entries when they navigate away, and nobody notices the data is gone. [hn, 2026-02-03](https://news.ycombinator.com/item?id=46878086)
- Scheduled jobs report success while silently failing to do their real work, such as completing backups. [hn, 2026-01-22](https://news.ycombinator.com/item?id=46717618)
- Teams discover hours later that payment or store notifications never arrived, silently breaking orders and records. [hn, 2025-12-01](https://news.ycombinator.com/item?id=46106504)
- Teams lose production data not because backups failed but because some critical stores were never included in backups. [hn, 2025-09-08](https://news.ycombinator.com/item?id=45171507)

**Why now:** Small businesses now run on a dozen connected services, and each new connection is another place data can silently stop moving.

pain 4 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 4 · openness 3

</details>

### P094 · Customer questions scattered across five inboxes

Small teams receive support requests through chat servers, code trackers, email and phone with no single place to see them, so urgent ones wait behind trivial ones. Customers sit through hold queues and phone trees, and a ticket stuck during payroll week can stop salaries going out.

**Challenge:** Answer a small team's routine support questions by voice or chat in minutes, and send the urgent ones straight to a person.

Rare · for businesses · global · teaches Voice AI, AI agents, Automation and integrations

<details><summary>Evidence (3) and scores (25)</summary>

- HR software users wait too long on support tickets during payroll week, exactly when a stuck query blocks salaries going out. [capterra, 2026-09-30](https://www.capterra.com/p/149253/Keka/reviews/?page=2#1)
- Small teams receive support requests across chat servers, code trackers and email with no single place to manage them. [hn, 2026-07-17](https://news.ycombinator.com/item?id=48942806)
- Customer phone calls still mean long holds and phone trees; people want a human because automated lines are so poor. [yc, 2025-05-08](https://www.ycombinator.com/rfs#summer-2025-voice-ai)

**Why now:** Voice agents became good and cheap enough in 2025 to answer a phone line, which removes the hold queue for routine questions.

pain 3 · frequency 5 · willingness 4 · buildability 4 · learning 5 · novelty 2 · openness 2

</details>

### P106 · Company knowledge that lives in three people's heads

Team know-how lives in a few heads, old email and chat threads, and internal wikis decay because writing things down is tedious and nobody keeps it up. Newcomers depend on whoever happens to know, search finds nothing useful, and work stalls whenever the right person is away.

**Challenge:** Capture what a team knows as a side effect of the work it already does, with nobody writing a wiki page.

Rare · for businesses · global · teaches AI agents, Data and dashboards, Automation and integrations

<details><summary>Evidence (5) and scores (25)</summary>

- Company know-how is scattered across heads, old email, chat threads and tickets, blocking automation and slowing newcomers. [yc, 2026-04-28](https://www.ycombinator.com/rfs#summer-2026-company-brain)
- Company knowledge bases decay because capturing and organising knowledge is tedious and people stop maintaining them. [hn, 2025-07-09](https://news.ycombinator.com/item?id=44511833)
- Internal wikis disappoint because tribal knowledge never gets written down, so search finds nothing useful. [hn, 2025-07-09](https://news.ycombinator.com/item?id=44510580)
- Documentation habits do not stick unless capture happens automatically; manual wiki upkeep gets abandoned. [hn, 2025-07-09](https://news.ycombinator.com/item?id=44507898)
- Team know-how lives in a few heads; newcomers depend on whoever happens to know, and written documentation never catches up. [hn, 2025-04-13](https://news.ycombinator.com/item?id=43676734)

**Why now:** Agents can now read chat and email continuously and keep a knowledge base current, removing the manual upkeep that made wikis decay.

pain 3 · frequency 4 · willingness 4 · buildability 4 · learning 5 · novelty 2 · openness 3

</details>

### P118 · Decisions made in chat never reach the task list

Small teams split work across chat, task and document tools, so decisions made in a chat thread never reach the task list and promises made aloud are forgotten. When the official chat or project tool is too heavy, staff move real discussions into personal messaging groups, scattering decisions and leaking company information.

**Challenge:** Turn every commitment made in a chat or a call into a tracked task with an owner and a date, automatically.

Rare · for businesses · global · teaches AI agents, Automation and integrations, Voice AI

<details><summary>Evidence (5) and scores (25)</summary>

- Team finds the all-in-one project tool heavy, slow and steep to learn, making adoption hard for everyday task tracking. [other, 2026-09-24](https://www.trustpilot.com/review/clickup.com#2)
- People forget spoken promises like sending a file or making an introduction, and nothing keeps track of them. [hn, 2026-06-15](https://news.ycombinator.com/item?id=48544813)
- Small teams split work across chat, task and document tools, and decisions made in chat never reach the task list. [hn, 2026-03-02](https://news.ycombinator.com/item?id=47219084)
- Official work chat tool failed so staff moved real work discussions into personal WhatsApp groups, leaking company information and scattering decisions. [hn, 2025-09-19](https://news.ycombinator.com/item?id=45301369)
- Professionals waiting on input from several colleagues lose track of who owes what and how long it has been. [hn, 2025-04-28](https://news.ycombinator.com/item?id=43819566)

**Why now:** Models can now reliably spot a commitment in a message or a call transcript, so tasks can be captured where they are made.

pain 3 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P130 · Typing is now the bottleneck

Workers spend much of the day writing messages and prompts, and typing speed has become the limit, especially for those who cannot type fast for long periods. Time away from a keyboard, such as a daily commute, is wasted even though email could be triaged and replies drafted by voice.

**Challenge:** Let someone clear their inbox and draft every reply by voice during a thirty-minute commute.

Rare · for consumers · global · teaches Voice AI, Mobile apps, AI agents

<details><summary>Evidence (3) and scores (25)</summary>

- Workers spend much of the day writing messages and struggle to balance clarity against speed. [hn, 2026-01-26](https://news.ycombinator.com/item?id=46766515)
- Commuters waste drive time they could use to triage email and draft replies by voice. [yc, 2025-05-08](https://www.ycombinator.com/rfs#summer-2025-ai-voice-assistants-email)
- Heavy AI chat users find typing speed has become their productivity bottleneck, especially those who cannot type fast for long periods. [hn, 2025-01-03](https://news.ycombinator.com/item?id=42587799)

**Why now:** Speech recognition and voice models became fast and accurate enough in 2025 to replace typing for most writing.

pain 2 · frequency 5 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P142 · Guessing what to build, then building it fast

Building software has become fast, but deciding what to build is still guesswork: aspiring builders cannot find problems people would pay to solve, and keyword research says nothing about unmet needs. Inside companies, every client request arrives labelled top priority, so product managers face chaos rather than evidence.

**Challenge:** Turn a pile of customer requests and public complaints into a ranked list of what to build, with the evidence attached.

Rare · for businesses · global · teaches AI agents, Data and dashboards, Full-stack web

<details><summary>Evidence (4) and scores (25)</summary>

- Teams have tools to write code fast but little help deciding what to build, which matters most and is still guesswork. [yc, 2026-02-03](https://www.ycombinator.com/rfs#spring-2026-cursor-for-product-managers)
- Indie builders find keyword research tools useless for discovering real, unmet user needs. [hn, 2026-01-24](https://news.ycombinator.com/item?id=46741671)
- Product managers face chaotic requirement gathering where every client request is labelled top priority. [hn, 2025-12-14](https://news.ycombinator.com/item?id=46262228)
- Aspiring builders find it very hard to discover problems that real people would actually pay to have solved. [hn, 2025-03-03](https://news.ycombinator.com/item?id=43245680)

**Why now:** Coding agents made building cheap in 2025, so the cost of building the wrong thing is now mostly the decision, not the code.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P153 · Customers who never say what went wrong

Local service businesses get almost no customer feedback because long surveys go unanswered, and early-stage makers struggle to keep any regular feedback loop with their users. Software teams likewise have little feel for their non-technical customers' daily work, so problems surface only when a customer leaves.

**Challenge:** Get a local business honest feedback from one customer in three, in under thirty seconds of their time.

Rare · for businesses · global · teaches Voice AI, Mobile apps, Automation and integrations · also Retail

<details><summary>Evidence (3) and scores (25)</summary>

- Makers struggle to set up a regular feedback loop with their early users. [hn, 2026-04-07](https://news.ycombinator.com/item?id=47673575)
- Local service businesses get little customer feedback because long surveys go unanswered. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#XtH6M28ZL)
- Software companies struggle to give their developers a real feel for non-technical customers' daily work. [hn, 2025-08-20](https://news.ycombinator.com/item?id=44959204)

**Why now:** Voice notes are now how many Indian customers prefer to talk, and transcribing and summarising them costs almost nothing.

pain 3 · frequency 4 · willingness 3 · buildability 5 · learning 4 · novelty 3 · openness 3

</details>

### P163 · Automations that break more than the work they replace

Workflow automation breaks often or needs more setup than the task itself, so employees keep repeating the same tedious steps every day. Many business workflows still need a person clicking through websites and desktop software with no other way in, and small agencies end up hand-writing scripts because nothing off the shelf fits.

**Challenge:** Let an office worker automate one daily chore by showing it once, and have it still work next month.

Rare · for businesses · global · teaches AI agents, Automation and integrations, Full-stack web

<details><summary>Evidence (4) and scores (25)</summary>

- Workflow automation tools break often or need more setup than the task itself; people would pay for something dependable. [hn, 2026-05-07](https://news.ycombinator.com/item?id=48045992)
- A small marketing agency hand-builds scripts to automate client work because off-the-shelf tools do not fit. [hn, 2025-08-25](https://news.ycombinator.com/item?id=45010145)
- Employees repeat the same tedious parts of their jobs daily and lack an easy way to build their own automations. [yc, 2025-05-08](https://www.ycombinator.com/rfs#summer-2025-internal-agent-builder)
- Many business workflows still need a person clicking through websites and desktop apps that offer no other way in. [yc, 2025-01-30](https://www.ycombinator.com/rfs#spring-2025-browser-automation)

**Why now:** Computer-use agents arrived in 2025 that can operate websites with no programmatic access, which covers the workflows older automation could not reach.

pain 3 · frequency 5 · willingness 4 · buildability 3 · learning 5 · novelty 2 · openness 3

</details>

### P173 · Professional work still done by hand after buying AI

Firms that buy AI tools still do the legal and professional work themselves, because what they bought helps a person do a job rather than deliver the finished result. Cleaning messy data and combining many documents into a reliable decision remain repetitive manual chores across industries.

**Challenge:** Deliver one finished back-office outcome, such as a cleaned dataset or a decision memo, rather than another assistant to do it with.

Epic · for businesses · global · teaches AI agents, Data and dashboards, Vision

<details><summary>Evidence (3) and scores (25)</summary>

- Combining information from many documents and posts into a reliable decision still takes heavy manual effort. [hn, 2026-05-07](https://news.ycombinator.com/item?id=48048190)
- Firms buying AI tools still do the legal and professional work themselves; few companies sell the finished outcome directly. [yc, 2025-05-08](https://www.ycombinator.com/rfs#summer-2025-full-stack-ai)
- Cleaning and restructuring messy data remains a frustrating, repetitive chore at work across many industries, often done by hand. [hn, 2025-02-06](https://news.ycombinator.com/item?id=42957473)

**Why now:** Agents became reliable enough in 2025 to finish multi-step document and data work, which makes selling the result, not the software, viable.

pain 3 · frequency 4 · willingness 4 · buildability 3 · learning 5 · novelty 3 · openness 3

</details>

### P182 · Personal help is still a rich person's luxury

Help with errands, admin and planning has only been affordable for the wealthy, and people trying to meet others for activities, services or dating still struggle to find the right match. Single people in their forties say they would pay well for real help getting past first dates.

**Challenge:** Give an ordinary person the life-admin and introductions help that used to need a personal assistant.

Epic · for consumers · global · teaches AI agents, Voice AI, Payments

<details><summary>Evidence (3) and scores (25)</summary>

- Matching people by shared interests, for activities, items or services, remains surprisingly unsolved across platforms. [hn, 2025-12-15](https://news.ycombinator.com/item?id=46277030)
- Single people in their forties struggle to get past first dates and say they would pay well for real help. [hn, 2025-06-23](https://news.ycombinator.com/item?id=44356701)
- Personal help with errands, admin and planning has only been affordable for the wealthy. [yc, 2025-01-30](https://www.ycombinator.com/rfs#spring-2025-ai-personal-staff)

**Why now:** Voice and agent models became good enough in 2025 to make calls, fill forms and book things for someone.

pain 3 · frequency 4 · willingness 4 · buildability 3 · learning 5 · novelty 3 · openness 3

</details>

### P191 · Freelance income decided by a ranking nobody explains

Established freelancers with perfect feedback watch client invitations collapse overnight when a marketplace changes its ranking, with no explanation and no way to recover. Fees keep rising, a single unfair rating on a refunded order cannot be contested, and generated proposals now bury real ones, so years of reputation can stop paying without warning.

**Challenge:** Give a freelancer a steady flow of clients that no single marketplace's ranking change can switch off.

Legendary · for creators · global · teaches Data and dashboards, Full-stack web, Automation and integrations · also Creators

<details><summary>Evidence (6) and scores (24)</summary>

- Freelancer says the marketplace keeps raising fees taken from freelancers while unprofessional clients and scammers remain common. [other, 2026-10-06](https://www.trustpilot.com/review/upwork.com#1)
- Top-rated freelancer with perfect feedback saw client invitations dry up after an opaque ranking algorithm change, with no way to recover visibility. [other, 2026-10-06](https://www.trustpilot.com/review/upwork.com#2)
- Established freelance seller reports inquiries collapsed since mid-2026 with no transparency about how AI-driven ranking decides visibility. [other, 2026-10-05](https://www.trustpilot.com/review/fiverr.com#2)
- Long-time Indian top-rated seller got a negative rating on an order that was already refunded, with no fair way to contest it. [other, 2026-10-05](https://www.trustpilot.com/review/fiverr.com#1)
- Experienced freelancers cannot win gigs because hiring platforms are flooded with automated proposals. [hn, 2026-09-26](https://news.ycombinator.com/item?id=49856000)
- Indian freelancer on a local marketplace finds project availability inconsistent month to month and communication from the platform opaque. [other, 2026-08-04](https://www.trustpilot.com/review/www.truelancer.com#1)

**Why now:** Marketplaces moved to AI-driven ranking in 2025 and 2026 and sellers report inquiries collapsing with no transparency, which makes owning a client channel urgent.

pain 5 · frequency 4 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P199 · Locked out of your earnings with nobody to call

Freelancers and tiny consultancies can lose access overnight to the account that holds their clients, bids and invoices, through a vague suspension, a restriction in the middle of bidding or a login failure. Support is automated or days away, so deadlines are missed and a whole income channel goes dark while they wait.

**Challenge:** Make sure a freelancer locked out of any one account still has their clients, invoices and history the same day.

Legendary · for creators · global · teaches Automation and integrations, Data and dashboards · also Creators

<details><summary>Evidence (3) and scores (24)</summary>

- Freelancer had account restricted mid-bidding after paying for connects and visibility boosts, and could not reach any human support. [other, 2026-10-05](https://www.trustpilot.com/review/upwork.com#5)
- Seller permanently suspended with vague reasons and no transparent appeal, losing their entire income channel overnight. [other, 2026-10-05](https://www.trustpilot.com/review/fiverr.com#3)
- Small consulting firm director missed invoice deadlines because login failures in the invoicing app locked them out, with poor support. [capterra, 2025-06-30](https://www.capterra.com/p/163114/Zoho-Invoice/reviews/#1)

**Why now:** Automated trust and safety systems now decide restrictions at scale and freelancers report reaching no human at all, so a portable copy of one's client book matters more each year.

pain 5 · frequency 2 · willingness 3 · buildability 4 · learning 2 · novelty 4 · openness 4

</details>

### P207 · Indian freelancers drowning in GST, TDS and scattered dues

Indian freelancers who cross the GST threshold must issue compliant invoices but rarely know how, while dues arrive as cash and bank transfers from many small clients that nobody reconciles. Very small firms find even quarterly TDS returns clumsy, so they pay for separate compliance software or an accountant to do what should be routine.

**Challenge:** Make a freelancer's GST invoices, TDS records and who-has-paid list correct by default, without an accountant.

Epic · for creators · India · teaches Payments, Data and dashboards, Vision · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- Small software company director says preparing quarterly TDS returns from the payroll tool is clumsy, pushing them to separate compliance software. [capterra, 2025-03-19](https://www.capterra.com/p/150850/greytHR/reviews/?page=2#2)
- Indian freelancers must issue GST-compliant invoices once over the threshold but often lack the know-how, making billing and accepting payment stressful. [other, 2024-02-08](https://razorpay.com/learn/scope-and-challenges-of-freelancers/#1)
- Indian freelancers juggle cash and bank transfers from many small clients, losing time chasing dues and reconciling who has paid. [other, 2024-02-08](https://razorpay.com/learn/scope-and-challenges-of-freelancers/#2)

**Why now:** UPI made dues arrive as dozens of small transfers, and GST and TDS obligations keep tightening for small earners who never had an accountant.

pain 4 · frequency 4 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P215 · Earned money stuck in holds, transfers and broken promises

Earned money routinely arrives late or not at all: freelancers wait out security holds plus a week of bank transfer, contractors paid through international payroll services still get stiffed by foreign employers, and staff at a collapsing startup can go unpaid for over a month. Without a clear record of what is owed and a cheap way to press for it, most simply absorb the loss.

**Challenge:** Help someone owed money for finished work turn their records into a claim the payer cannot ignore.

Legendary · for creators · global · teaches AI agents, Data and dashboards · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- Freelancer waits a five-day security hold plus over a week for bank transfer before earned money actually arrives. [other, 2026-10-05](https://www.trustpilot.com/review/upwork.com#4)
- Contractor paid through an international payroll platform still faces non-payment from a foreign employer with little leverage to collect. [other, 2026-10-03](https://www.trustpilot.com/review/deel.com#1)
- Indian startup shutdown left 300 employees jobless without notice, many unpaid for over a month, showing workers have little protection on dues. [news, 2025-11-17](https://inc42.com/features/indian-startup-layoff-tracker-2025/)

**Why now:** Language models can now draft a firm, specific demand from an invoice and chat trail in minutes, and startup shutdowns that leave staff unpaid keep making the news.

pain 5 · frequency 3 · willingness 2 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P221 · Paying job portals for faraway and fake candidates

Small Indian employers pay monthly fees to job portals and still get candidates living 30 km away for a job that needs someone within 3 km, resume downloads that turn out to be train tickets and blank pages, and memberships that hide contact details. Recruiters everywhere report mass-generated applications drowning qualified people, so a small shop spends money and still cannot fill a basic role.

**Challenge:** Get a neighbourhood employer three genuine, nearby candidates for an entry-level role within a week.

Epic · for businesses · India · teaches Mobile apps, Vision, Data and dashboards · also Retail

<details><summary>Evidence (4) and scores (24)</summary>

- Employer downloaded fifty resumes from a hiring app and many were junk files like train tickets and blank pages. [other, 2026-08-19](https://www.trustpilot.com/review/workindia.in#2)
- Local employer needing staff within 2-3 km kept receiving candidates living 30 km away despite paying a monthly hiring fee. [other, 2026-08-13](https://www.trustpilot.com/review/workindia.in#1)
- Indian employer discovered the paid job portal membership did not include candidate contact details, and there was no phone support. [other, 2026-04-14](https://www.trustpilot.com/review/naukri.com?page=2#4)
- Mass AI-generated job applications are drowning out qualified candidates in recruiters' inboxes. [hn, 2025-08-30](https://news.ycombinator.com/item?id=45073910)

**Why now:** Hyperlocal hiring moved onto phones and paid unlocks, and employers now pay per lead for leads that are often junk.

pain 4 · frequency 4 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P226 · Paying for profile boosts that nobody sees

Job seekers pay for profile boosting and still see zero recruiter views for months, while their search visibility drops without explanation and sales calls push more upgrades. Many say they would rather pay for one guaranteed interview than keep paying to vanish into applicant pools.

**Challenge:** Turn what a job seeker is willing to pay into a guaranteed conversation with a real hiring manager.

Legendary · for consumers · India · teaches Payments, Full-stack web · also Education

<details><summary>Evidence (3) and scores (24)</summary>

- Job seeker paid around 200 dollars for profile boosting yet saw zero recruiter profile views over six months. [other, 2026-05-15](https://www.trustpilot.com/review/naukri.com?page=2#2)
- Job seeker saw search visibility suddenly drop with no explanation while being hounded by daily sales calls to upgrade. [other, 2026-04-23](https://www.trustpilot.com/review/naukri.com?page=2#3)
- Job seekers say they would pay for a guaranteed technical interview rather than vanish into applicant pools. [hn, 2025-12-12](https://news.ycombinator.com/item?id=46245536)

**Why now:** With generated applications flooding every role, visibility has become the scarce good, and seekers already pay for it without proof that it works.

pain 4 · frequency 3 · willingness 4 · buildability 3 · learning 2 · novelty 4 · openness 4

</details>

### P231 · Payroll errors found only after salaries go out

Small firms pay for all-in-one HR suites that feel expensive for their size and still get payroll data errors, missing tax forms and income tax computed wrong for a whole year. Support lacks product knowledge or takes a week, so mistakes surface after salaries go out and HR fixes them by hand.

**Challenge:** Catch every payroll and tax mistake before salaries go out, not after employees complain.

Epic · for businesses · India · teaches Data and dashboards, AI agents, Automation and integrations · also Money

<details><summary>Evidence (4) and scores (24)</summary>

- Small IT firm owner hit missing tax forms, payroll data errors and week-long support waits on a payroll tool, making compliance unreliable. [capterra, 2026-05-18](https://www.capterra.com/p/186299/Zoho-Payroll/reviews/)
- Incumbent business software has grown bloated and pricey, leaving room for leaner challengers now that building software is cheaper. [yc, 2026-04-28](https://www.ycombinator.com/rfs#summer-2026-saas-challengers)
- HR executive found employee income tax computations wrong for a whole financial year, and HRMS support lacked product knowledge to fix it. [capterra, 2025-02-12](https://www.capterra.com/p/149253/Keka/reviews/#2)
- Small consumer services company CEO finds the all-in-one HRMS a bit expensive for their size despite liking the features. [capterra, 2025-01-07](https://www.capterra.com/p/149253/Keka/reviews/?page=2#2)

**Why now:** Indian tax regimes and payroll rules changed repeatedly in 2025, and suites are not keeping up, which makes an independent check worth paying for.

pain 4 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P235 · Shift rosters and hourly attendance kept on paper

HR software is built for salaried desk staff, so shift workers cannot fix a forgotten clock-in, managers cannot see who is off on a given day, and recurring rosters must be recopied every few months. Hours from swipe cards and deskless staff do not export cleanly into payroll, and volunteers do not fit at all, so every pay run starts with manual fixes.

**Challenge:** Make the weekly roster and the hours that reach payroll match without anybody retyping them.

Rare · for businesses · global · teaches Mobile apps, Automation and integrations, Data and dashboards · also Retail

<details><summary>Evidence (7) and scores (24)</summary>

- Manufacturing controller finds deskless staff hours do not export cleanly into the payroll system, forcing manual fixes each run. [capterra, 2026-09-17](https://www.capterra.com/p/153140/Connecteam/reviews/#4)
- Non-profit leader cannot find any way to manage volunteer workers inside an HR system built only for salaried employees. [capterra, 2026-07-28](https://www.capterra.com/p/110931/Zoho-People/reviews/#3)
- Clinic HR manager cannot see all staff absences at once or block dates when too many leave requests pile onto one day. [capterra, 2026-07-07](https://www.capterra.com/p/153140/Connecteam/reviews/#3)
- Small entertainment business finds shift workers cannot fix a forgotten clock-in until the shift ends, creating messy attendance records. [capterra, 2026-05-25](https://www.capterra.com/p/153140/Connecteam/reviews/#2)
- Tiny non-profit cannot set permanent recurring shift schedules and must recopy identical weekly rosters every few months. [capterra, 2026-04-22](https://www.capterra.com/p/153140/Connecteam/reviews/#5)
- HR manager at a telecom firm finds attendance reconciliation using swipe-card data slow and painful inside the payroll system. [capterra, 2025-05-29](https://www.capterra.com/p/150850/greytHR/reviews/?page=2#3)
- Each industry has repetitive specialist workflows that general software never fits well. [yc, 2025-01-30](https://www.ycombinator.com/rfs#spring-2025-vertical-ai-agents)

**Why now:** Every shift worker now carries a smartphone, so attendance no longer needs a swipe terminal, and payroll systems expose import formats that make clean hand-offs possible.

pain 3 · frequency 5 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P237 · Product changes customers hear about from the outage

Software makers ship breaking changes and changed features with little warning, and customers either miss the changelog or never get one, so the first notice is an outage or a wrong payroll run. Teams that do write release notes rewrite them by hand several times for engineers, admins and non-technical users.

**Challenge:** Make sure every customer learns about a change that affects them, in their own terms, before it ships.

Rare · for businesses · global · teaches AI agents, Automation and integrations, Full-stack web

<details><summary>Evidence (3) and scores (24)</summary>

- Software makers ship breaking changes with little warning and customers miss changelogs, causing outages for teams that depend on them. [yc, 2026-07-22](https://www.ycombinator.com/rfs#fall-2026-self-maintaining-apis)
- Companies rewrite the same release notes several times for different audiences, including non-technical users. [hn, 2025-12-13](https://news.ycombinator.com/item?id=46257486)
- People team at a real estate firm hits payroll calculation errors and finds features changed without notice, with no dedicated support contact. [capterra, 2025-08-06](https://www.capterra.com/p/150850/greytHR/reviews/?page=2#1)

**Why now:** Models can now read a diff and say who it affects, so release communication can be targeted instead of broadcast.

pain 3 · frequency 3 · willingness 3 · buildability 5 · learning 4 · novelty 3 · openness 3

</details>

### P239 · Half the workday spent saying what you did

Employees spend hours in status meetings that a short written update could replace, yet engineers will not keep task boards current after stand-ups. Managers get guesswork, and the people doing the work are interrupted again and again to feed status reports.

**Challenge:** Give managers an accurate status of every task without one meeting or one manual board update.

Rare · for businesses · global · teaches AI agents, Automation and integrations, Voice AI

<details><summary>Evidence (3) and scores (24)</summary>

- Employees spend half the day in status meetings that brief written updates could replace. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#TZsIBXpkQ)
- Developers are constantly interrupted to update tickets for managers who are not close to the work, breaking focus to feed status reports. [hn, 2025-12-07](https://news.ycombinator.com/item?id=46185358)
- Managers cannot get engineers to keep task boards updated after stand-ups, so project status becomes guesswork. [hn, 2025-04-25](https://news.ycombinator.com/item?id=43793662)

**Why now:** Agents can now read commits, tickets and chat and write an accurate status update, so nobody has to type one.

pain 3 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P241 · A dozen dashboards checked before the day begins

Founders of small teams spend half an hour each morning checking a dozen services for code changes, messages and payments, and knowledge workers lose deep focus to constant switching between tabs, chats and email. Lean companies can now be built with little capital, but the tooling to run them without this overhead is immature.

**Challenge:** Give a small-team founder one morning briefing that replaces checking twelve dashboards.

Rare · for businesses · global · teaches AI agents, Automation and integrations, Data and dashboards

<details><summary>Evidence (3) and scores (24)</summary>

- Founders spend half an hour each morning checking a dozen apps for code changes, messages and payments. [hn, 2026-01-21](https://news.ycombinator.com/item?id=46702458)
- Small teams can now build big companies with little capital, but the tooling to run such lean operations is immature. [yc, 2025-07-30](https://www.ycombinator.com/rfs#fall-2025-first-10-person-100b-company)
- Constant switching between tabs, chats and email makes deep, sustained focus hard for knowledge workers. [hn, 2025-06-03](https://news.ycombinator.com/item?id=44173039)

**Why now:** Teams of a handful now run companies that once needed dozens, so the overhead of watching every service falls on one or two people.

pain 2 · frequency 5 · willingness 3 · buildability 5 · learning 4 · novelty 2 · openness 3

</details>

### P243 · Small business websites nobody has ever checked

Small firms running websites and online stores cannot afford accessibility audits or security checks, so screen-reader users are shut out and malware or holes go unnoticed. A growing share of visitors are now software agents that browse, buy and update records, and sites built only for humans clicking buttons fail them too.

**Challenge:** Tell a small online store, in one afternoon, what stops a blind shopper, an attacker or a buying agent on its site.

Epic · for businesses · global · teaches Vision, AI agents, Full-stack web · also Retail

<details><summary>Evidence (4) and scores (24)</summary>

- AI agents increasingly browse, buy and update records, but they do it on software designed for humans clicking buttons. [yc, 2026-04-28](https://www.ycombinator.com/rfs#summer-2026-software-for-agents)
- Small firms running websites or online stores lack the budget and skills to check for security holes or malware. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ltxpCnihU)
- Small teams want accessible websites but cannot afford dedicated accessibility audits or specialists. [hn, 2025-12-02](https://news.ycombinator.com/item?id=46121253)
- Websites are built for human visitors while a growing share of traffic is software agents that must impersonate people. [yc, 2025-01-30](https://www.ycombinator.com/rfs#spring-2025-b2a-software)

**Why now:** Shopping and booking agents started browsing the web on users' behalf in 2025, so a site that agents cannot use now loses sales.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 4 · openness 3

</details>

### P245 · Job ad budgets burned on clicks, not hires

Small employers find free job posts get no visibility, sponsored posts and pay-per-click ads always spend the full monthly budget, and job board subscriptions can quadruple in price while results get worse. What arrives is a flood of irrelevant, mass-produced applications, so the cost per real hire keeps rising for businesses that can least afford it.

**Challenge:** Cut a small employer's cost per genuine applicant in half without raising their job ad spend.

Rare · for businesses · global · teaches Data and dashboards, Automation and integrations, Full-stack web

<details><summary>Evidence (4) and scores (23)</summary>

- Employer suspects pay-per-click job ads always max out the monthly click budget without delivering qualified applicants. [other, 2026-10-06](https://www.trustpilot.com/review/www.indeed.com#4)
- Small employer saw job board subscription jump from about 120 to 520 dollars a month while the product got worse. [other, 2026-09-28](https://www.trustpilot.com/review/www.indeed.com#1)
- Small cleaning company says free job posts get no visibility, pushing it into paid sponsorship it can barely afford to fill basic roles. [other, 2026-09-23](https://www.trustpilot.com/review/www.indeed.com#2)
- Hiring managers who post openings get flooded with irrelevant, mass-produced applications. [hn, 2025-10-01](https://news.ycombinator.com/item?id=45444795)

**Why now:** Job boards shifted toward paid-only visibility and raised prices, while generated applications cut the value of every click.

pain 3 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P246 · Fake jobs and fake candidates on both sides

Job seekers are scammed by fake postings that demand laptop deposits, or by take-home tests that plant malware or harvest unpaid work. Employers on the same job sites get candidates who lie about availability and leads that are fake, so neither side can trust the first contact and both lose money.

**Challenge:** Let a job seeker check, in under a minute, whether a job offer or test is real before they pay or download anything.

Epic · for consumers · India · teaches AI agents, Full-stack web, Data and dashboards

<details><summary>Evidence (3) and scores (23)</summary>

- Employer hiring entry-level staff says candidates lied about availability and leads were fake, with no support after payment. [other, 2026-07-07](https://www.trustpilot.com/review/workindia.in#3)
- Job seeker found fake tech job postings demanding laptop deposits, showing poor employer verification on job apps. [other, 2026-05-29](https://www.trustpilot.com/review/workindia.in#4)
- Job seekers are being scammed through fake take-home coding tests that plant malware or harvest unpaid work. [hn, 2025-01-25](https://news.ycombinator.com/item?id=42825902)

**Why now:** Remote hiring and generated text made fake recruiters cheap to run, and Indian job seekers increasingly report deposit and laptop scams on job sites.

pain 4 · frequency 3 · willingness 2 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P247 · Job matches that ignore everything you said

Indian job seekers report that nearly every recommended job is unrelated to their profile, and posting a profile brings a flood of spam calls and messages. Listings marked remote often turn out to be restricted by region, so hours go into filtering roles that were never a real fit.

**Challenge:** Cut the jobs a seeker has to read by nine in ten, while missing none that truly fit.

Rare · for consumers · India · teaches AI agents, Data and dashboards, Mobile apps · also Education

<details><summary>Evidence (3) and scores (23)</summary>

- Job seeker says almost all recommended jobs are unrelated to their profile, wasting hours filtering irrelevant listings. [other, 2026-06-16](https://www.trustpilot.com/review/naukri.com#6)
- Indian job seeker gets irrelevant job recommendations plus a flood of spam calls and messages after posting a profile. [other, 2026-04-26](https://www.trustpilot.com/review/naukri.com?page=2#1)
- Jobs advertised as remote often turn out to be region-restricted, wasting applicants' time. [hn, 2026-01-10](https://news.ycombinator.com/item?id=46566918)

**Why now:** Language models can now read a listing's fine print, such as region limits and real requirements, at almost no cost per job.

pain 3 · frequency 5 · willingness 2 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P248 · Every AI conversation starts from zero

Heavy users of AI assistants cannot find old conversations once dozens pile up each day, keep reusable prompts scattered in notes, and must repeat the same background to every assistant they use. Those chats are private by design, so a team cannot build on each other's work with agents the way it does in a shared document.

**Challenge:** Make what a person or team has already told any AI assistant findable and reusable everywhere they work.

Rare · for consumers · global · teaches AI agents, Full-stack web, Data and dashboards

<details><summary>Evidence (4) and scores (23)</summary>

- AI assistants are used alone in private chats, so teams cannot work together with agents the way they do in shared documents. [yc, 2026-07-22](https://www.ycombinator.com/rfs#fall-2026-multiplayer-ai)
- People using several AI assistants must repeat the same background to each because nothing shares memory between them. [hn, 2026-02-04](https://news.ycombinator.com/item?id=46885728)
- People reuse dozens of AI prompts but keep them scattered in notes apps with no easy way to retrieve them. [hn, 2025-10-11](https://news.ycombinator.com/item?id=45548985)
- Heavy AI chat users cannot find old conversations once the history list fills with dozens of chats a day. [hn, 2025-10-05](https://news.ycombinator.com/item?id=45478654)

**Why now:** Assistants added memory and project spaces in 2025, but each keeps its own, so the problem moved from forgetting to fragmentation.

pain 2 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 2

</details>

### P249 · A good product, and not one paying user

Solo and side-project builders spend a year on a working product and then stall at a few dozen users, because distribution, not engineering, is the bottleneck. Cold emails to small firms get no reply in inboxes flooded by generated outreach, demos go unwatched, and individuals rarely pay for small software even when their employers would.

**Challenge:** Get a solo builder's working product its first ten paying customers in three weeks.

Rare · for businesses · global · teaches AI agents, Full-stack web, Automation and integrations · also Creators

<details><summary>Evidence (8) and scores (23)</summary>

- Side-project builders discover that finding first paying users is far harder than building the product. [hn, 2026-06-29](https://news.ycombinator.com/item?id=48715575)
- Most AI startups sell tools that help people do a job; few deliver the finished service itself at software-like cost. [yc, 2026-04-28](https://www.ycombinator.com/rfs#summer-2026-ai-native-service-companies)
- Well-engineered tools sit at a few dozen users because distribution, not engineering, is the bottleneck. [hn, 2026-04-22](https://news.ycombinator.com/item?id=47862180)
- People selling software to small firms get few email replies even after promising first meetings. [hn, 2026-01-30](https://news.ycombinator.com/item?id=46830719)
- AI-written cold outreach has flooded inboxes, burying the messages people actually need to read. [hn, 2026-01-23](https://news.ycombinator.com/item?id=46733696)
- Small software firms find product demos hard: videos go unwatched and screenshots miss the context buyers need. [hn, 2025-06-11](https://news.ycombinator.com/item?id=44250247)
- Individuals rarely pay for small web tools themselves, while employers will pay if a tool saves team time. [hn, 2025-05-18](https://news.ycombinator.com/item?id=44020316)
- A solo builder spent a year on a niche software product beside a day job and cannot find first paying customers. [hn, 2025-02-25](https://news.ycombinator.com/item?id=43176631)

**Why now:** Building software got cheap in 2025, so far more products now compete for the same inboxes, and distribution became the scarce skill.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P250 · Code ships faster than anyone can check it

AI coding has let small teams ship code far faster, but startups without testers cannot keep quality up, and tiny companies grep raw logs instead of getting alerts when production breaks. Teams now build small bespoke internal software with agents, yet testing pipelines and running that software safely stays slow and fragile.

**Challenge:** Catch the bug a small team's AI-written code introduced before a customer does, without hiring a tester.

Rare · for businesses · global · teaches AI agents, Automation and integrations, Full-stack web

<details><summary>Evidence (4) and scores (23)</summary>

- Teams want small bespoke tools for their own workflows, and agents make them easy to build, but sharing and running them safely stays hard. [yc, 2026-07-22](https://www.ycombinator.com/rfs#fall-2026-a-cloud-for-small-software)
- Startups without testers struggle to keep quality up as AI speeds up how fast code ships. [hn, 2026-06-29](https://news.ycombinator.com/item?id=48720627)
- Developers waste time testing build pipelines through repeated commits because they cannot reproduce that environment locally. [hn, 2025-12-27](https://news.ycombinator.com/item?id=46400062)
- Tiny companies lack affordable visibility into production problems and end up grepping raw logs instead of getting proper alerts. [hn, 2025-01-25](https://news.ycombinator.com/item?id=42822836)

**Why now:** Coding agents multiplied how much code a small team ships in 2025, while the number of people checking it stayed the same.

pain 3 · frequency 4 · willingness 4 · buildability 3 · learning 5 · novelty 2 · openness 2

</details>

## Creators and media

### P005 · Hindi creators flying blind on their own numbers

Hindi-speaking creators see watch hours that do not match what counts toward monetization and reach that stalls with no guidance on what to improve. Makers who post daily hit the same silence, so effort keeps going into content without any feedback loop.

**Challenge:** Give a Hindi-speaking creator a weekly coaching note, in Hindi, on what to change next and why.

Epic · for creators · India · teaches Data and dashboards, Voice AI, AI agents · also Education

<details><summary>Evidence (3) and scores (27)</summary>

- Hindi-speaking creator sees watch hours in analytics far higher than those counted toward monetization and cannot understand the gap. [forum, 2026-10-06](https://support.google.com/youtube/thread/471586660/watch-hours)
- Hindi-speaking Shorts creator sees reach stall and subscriber growth stop, with no guidance on what to improve. [forum, 2026-10-06](https://support.google.com/youtube/thread/471572385/ki-reach-nhi-badh-rahi-hai-please-clear-kijiye)
- Makers posting daily on social channels get no traction because AI-generated noise drowns them out. [hn, 2026-07-17](https://news.ycombinator.com/item?id=48947498)

**Why now:** Regional-language creators now outnumber others in India, and voice and language models handle Hindi well enough in 2025 to coach in it.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 5 · novelty 4 · openness 4

</details>

### P017 · Small communities drowning in bots and bad uploads

Small sites and communities that host user posts must moderate uploads, bots and abuse, but trusted human moderators cost more than they can pay. Readers get flooded with mail they never asked for, and small products struggle even to keep young children away from adult ads.

**Challenge:** Keep a small community clean of bots, spam and unsafe uploads for less than the cost of one moderator.

Rare · for businesses · global · teaches Vision, AI agents · also Work

<details><summary>Evidence (5) and scores (27)</summary>

- Reader gets flooded with newsletters they never subscribed to, and reporting abuse requires creating an account. [other, 2026-09-02](https://www.trustpilot.com/review/substack.com#4)
- Online communities are flooding with bot posts and cannot filter them without demanding real identities. [hn, 2026-03-01](https://news.ycombinator.com/item?id=47204278)
- App makers find young children clicking their ads, with no simple way to keep products age-appropriate. [hn, 2026-01-26](https://news.ycombinator.com/item?id=46767934)
- A small hosting startup had to build its own moderation for user uploads because affordable options did not exist. [hn, 2025-01-26](https://news.ycombinator.com/item?id=42830018)
- Moderating user uploads still needs trusted human moderators that small platforms cannot afford. [hn, 2025-01-26](https://news.ycombinator.com/item?id=42833033)

**Why now:** Cheap AI-generated posts flooded small communities in 2025, while vision and text classifiers became cheap enough for a small host to run.

pain 4 · frequency 5 · willingness 4 · buildability 4 · learning 5 · novelty 2 · openness 3

</details>

### P029 · Deepfakes and finfluencers selling to young investors

Deepfake videos of well-known figures push fake investment links, and finance influencers hide conflicts or misrepresent their results. Young Indian followers lose money acting on advice they cannot verify, while real information drowns under machine-made filler.

**Challenge:** Help a young investor check a finance video's claims and its speaker before they act on it.

Mythic · for consumers · India · teaches Vision, Voice AI, AI agents · also Money

<details><summary>Evidence (3) and scores (27)</summary>

- Deepfake videos of a well-known public figure push fake investment links, and Indian viewers are fooled into trusting the endorsement. [news, 2025-12-18](https://www.news18.com/india/sudha-murty-deepfake-video-viral-investment-opportunities-fake-link-promotion-digital-cyber-fraud-9779772.html)
- Young Indian followers lose money acting on finance influencers who hide conflicts or misrepresent results, with no easy way to verify credibility. [news, 2025-10-13](https://www.financialexpress.com/money/insights/warning-over-60-of-indian-finfluencers-are-hiding-the-truth-are-you-a-victim/4009464/)
- Viewers looking for real information on video platforms keep landing on AI-generated filler content. [hn, 2025-07-24](https://news.ycombinator.com/item?id=44675330)

**Why now:** Deepfake scams using public figures surged in India in 2025, and the securities regulator moved against unregistered finance influencers.

pain 5 · frequency 4 · willingness 2 · buildability 3 · learning 5 · novelty 4 · openness 4

</details>

### P041 · Suspended overnight and never told why

Indian creators lose channels and seller accounts overnight for policy breaches nobody names, sometimes over a linked account they cannot even identify. Appeals vanish without a reply, so a business built over years stops earning with no way to fix the actual problem.

**Challenge:** Turn a vague suspension notice into a clear, evidence-backed appeal filed in one afternoon.

Mythic · for creators · India · teaches AI agents, Full-stack web · also Work

<details><summary>Evidence (3) and scores (26)</summary>

- Devotional channel was suspended from the partner programme over an unnamed related channel, with no way to find which account triggered it. [forum, 2026-10-03](https://support.google.com/youtube/thread/471225716/my-channel-was-suspended-from-ypp-due-to-a-related-channel)
- Gaming channel was removed and the creator has heard nothing back on the appeal claiming the content was original. [forum, 2026-10-03](https://support.google.com/youtube/thread/471237243/respected-team-i-have-not-received-any-response-for-my-appeal-submitted-on-date-my-channel-raa)
- Account suspended with no clear explanation of which policy was broken, leaving the user unable to fix or appeal meaningfully. [appstore, 2026-05-22](https://apps.apple.com/in/app/instagram/id389801252?see-all=reviews#2)

**Why now:** Enforcement on large video and social services is now largely automated, so wrongful suspensions are more frequent and human review is harder to reach.

pain 5 · frequency 2 · willingness 4 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P053 · Real creators flagged as fake, fake ones adored

Crackdowns on machine-made content are mislabelling genuine work and burying faceless creators who put in real effort. Meanwhile a fully synthetic persona can gather millions of followers who believe it is a person, so honest creators pay for a problem they did not cause.

**Challenge:** Let a genuine creator prove a piece of work is theirs and human-made, in a way viewers and reviewers can check.

Mythic · for creators · global · teaches Vision, Data and dashboards

<details><summary>Evidence (3) and scores (26)</summary>

- Platform auto-labelled a green-screen video as AI generated and locked the label, so the creator cannot correct a misleading tag on their own work. [forum, 2026-10-05](https://support.google.com/youtube/thread/471549566/what-do-i-do-if-youtube-labeled-my-video-as-ai-generated-when-there-is-no-ai-involved)
- Crackdowns on AI slop are hurting genuine faceless creators, as the algorithm now favours on-camera hosts regardless of effort. [news, 2026-06-15](https://thenextweb.com/news/youtube-ai-slop-crackdown-faceless-creators-collateral-damage)
- A fully AI-generated influencer persona amassed millions of followers who believed she was real, showing fans cannot tell synthetic creators apart. [news, 2026-04-21](https://www.rediff.com/news/report/how-indian-medic-profited-from-fake-ai-influencer-emily-hart/20260422.htm)

**Why now:** Automatic labels for synthetic media rolled out across the major video services in 2025, and audiences are now primed to doubt what they see.

pain 4 · frequency 3 · willingness 2 · buildability 3 · learning 5 · novelty 5 · openness 4

</details>

### P065 · Brand money stops at the metro limits

Two thirds of Indian creators come from smaller cities and regional-language creators now outnumber the rest, yet brand spend still flows mostly to metro creators. Most land one paid campaign a year, and affiliate networks assume an agency, so small creators rarely turn work into steady income.

**Challenge:** Help a small-town creator land their second paid campaign this quarter, not next year.

Legendary · for creators · India · teaches AI agents, Data and dashboards · also Money

<details><summary>Evidence (4) and scores (26)</summary>

- Most Indian creators land only one paid campaign a year, so creating rarely becomes a sustainable income. [news, 2026-07-14](https://www.isb.edu/news/press-releases/india-s-creator-economy-enters-a-new-phase-as-non-metro-creators-become-the-majority-reveals-isb-hashfame-report#1)
- Regional-language creators now outnumber others in India, but brand spend in many language ecosystems lags far behind creator supply. [news, 2026-07-14](https://www.isb.edu/news/press-releases/india-s-creator-economy-enters-a-new-phase-as-non-metro-creators-become-the-majority-reveals-isb-hashfame-report#2)
- Two thirds of Indian creators come from smaller cities, but the brand money still flows mostly to metro creators. [news, 2026-07-14](https://www.moneycontrol.com/technology/smaller-cities-now-account-for-two-thirds-of-india-s-creators-but-not-big-pay-cheques-article-13973083.html)
- Affiliate and performance marketing platforms are cluttered and assume an agency, shutting out small creators and publishers trying to monetize. [hn, 2025-05-22](https://news.ycombinator.com/item?id=44059240)

**Why now:** Regional-language creators overtook others in India, and local and D2C brands are moving budget into regional markets.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 4 · openness 4

</details>

### P077 · Influencer spend nobody can prove

Two in five Indian brands say they cannot measure return on influencer campaigns, and judging them with direct-response metrics misses the trust built over time. Agencies spend hours every week exporting and cleaning ad data into client reports, yet budget meetings still end on the same question.

**Challenge:** Show a brand what each creator campaign actually returned, in a report that builds itself.

Epic · for businesses · India · teaches Data and dashboards, Automation and integrations · also Retail

<details><summary>Evidence (5) and scores (26)</summary>

- D2C brands judge influencer campaigns with outdated direct-response metrics that miss trust and consideration, so boards question the spend. [news, 2026-09-17](https://brandequity.economictimes.indiatimes.com/news/marketing/d2c-brands-are-measuring-influencer-marketing-with-the-wrong-ruler-and-their-boards-are-about-to-notice/134325359)
- Marketing heads see feeds flooded with creator content that audiences see through, and struggle to prove influencer spend pays off. [news, 2026-05-19](https://brandequity.economictimes.indiatimes.com/news/marketing/influencer-roi-heres-what-cmos-are-missing/131214700)
- Agencies spend hours weekly exporting ad data, cleaning it and building client reports in spreadsheets. [hn, 2026-04-01](https://news.ycombinator.com/item?id=47599925)
- Indian brands have moved past experimenting with influencers, but return on investment questions still dominate every budget conversation. [news, 2026-01-07](https://www.exchange4media.com/influence-zone-news/influencer-roi-can-india-close-the-gap-with-global-markets-150763.html)
- Two in five brands complain they cannot measure return on investment from influencer campaigns. [news, 2025-06-12](https://www.livemint.com/news/fake-followers-and-murky-return-astatine-ai-investment-pushes-brands-rejig-influencer-strategy-youtube-wow-plum-goodness-11749725710153.html#2)

**Why now:** Indian brands' creator budgets grew past experimentation by 2025, so boards now ask for proof, and storefront data can be joined to campaigns cheaply.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P089 · Lakhs owed, and brands pay whenever they like

Indian creators and small influencer agencies routinely wait two months to over a year for brands to pay, while still chasing approvals and revisions. With no manager, one-person creators negotiate, invoice and chase alone, so many now refuse work without a 25 to 50 percent advance.

**Challenge:** Get a creator paid on time for brand work without them sending a single awkward reminder.

Epic · for creators · India · teaches Payments, Automation and integrations · also Money

<details><summary>Evidence (7) and scores (25)</summary>

- Late brand payments leave Indian creators with lakhs stuck in limbo, so widespread that an agency now pays creators from its own balance sheet. [news, 2026-09-16](https://www.moneycontrol.com/technology/late-payments-lakhs-in-limbo-creators-grapple-with-delayed-dues-article-14030957.html)
- Small independent Indian creators struggle with payment delays and inconsistent work even as brands increasingly hire them. [news, 2026-08-31](https://www.livemint.com/industry/media/creator-economy-influencers-nano-creators-micro-creators-influencer-marketing-brand-collaboration-payment-delays-11788168088114.html)
- Creators below half a million followers have no management team and run brand negotiations, invoicing and contracts alone as a one-person business. [hn, 2026-04-04](https://news.ycombinator.com/item?id=47642575)
- Indian beauty creator says invoices to large ecommerce and beauty brands routinely go unpaid for over two months, wrecking cash flow. [news, 2026-02-11](https://www.freepressjournal.in/tech/nykaa-flipkart-lakme-under-fire-after-beauty-influencer-ayesha-sanghi-calls-out-big-brands-for-delayed-payments#1)
- Creators describe brand micromanagement during collaborations and the emotional strain of repeatedly chasing money they are owed. [news, 2026-02-11](https://www.freepressjournal.in/tech/nykaa-flipkart-lakme-under-fire-after-beauty-influencer-ayesha-sanghi-calls-out-big-brands-for-delayed-payments#2)
- Small influencer agencies on thin margins are squeezed because big consumer brands pay well beyond the 90-day cycle, some dues outstanding over a year. [news, 2025-07-28](https://www.storyboard18.com/brand-makers/payment-delays-plague-influencer-marketing-agencies-as-major-brands-lag-behind-77033.htm#1)
- Indian creators refuse new brand work until old dues clear and increasingly demand 25 to 50 percent advances because payments arrive months late. [news, 2025-07-28](https://www.storyboard18.com/brand-makers/payment-delays-plague-influencer-marketing-agencies-as-major-brands-lag-behind-77033.htm#2)

**Why now:** Indian brands shifted large budgets to creators in 2025, payment terms stretched with them, and UPI collections now make instant payment links trivial.

pain 5 · frequency 4 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P101 · Independent writers vanishing from search and answers

Independent blogs and niche forums have become hard to find through mainstream search, and staying visible in search and AI answers now takes a huge content effort with uncertain returns. As synthetic content floods feeds, audiences trust less and human writers get buried beneath it.

**Challenge:** Get a small independent writer found by the readers already searching for exactly what they write.

Epic · for creators · global · teaches Full-stack web, Data and dashboards

<details><summary>Evidence (3) and scores (25)</summary>

- As synthetic content floods feeds, audiences find it harder to trust what they see compared with real human creators. [news, 2026-10-05](https://www.exchange4media.com/influence-zone-news/ai-slop-vs-ugc-as-synthetic-content-speeds-up-can-it-win-the-trust-game-158901.html)
- Small companies find staying visible in search and AI answers a huge content effort with uncertain returns. [hn, 2026-02-05](https://news.ycombinator.com/item?id=46906074)
- Niche forums and independent blogs have become hard to find through mainstream search engines. [hn, 2025-07-21](https://news.ycombinator.com/item?id=44634391)

**Why now:** AI answers began replacing clicks in 2025, cutting traffic to small sites and making visibility in answer engines a new skill.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P113 · When the money breaks, only a bot answers

Creators and small sellers who pay for creator services find support replaced by chatbots that deny their account exists and agents who cannot resolve linking loops. In India, account managers change without notice after payment, and unresponsive payment support has sunk an event's ticket sales.

**Challenge:** Get a small seller's stuck money or broken account in front of a human who can fix it, within a day.

Legendary · for creators · India · teaches AI agents, Voice AI · also Money

<details><summary>Evidence (4) and scores (25)</summary>

- Indian creator account manager changed without notice and support became unreachable after the subscription was paid. [other, 2026-10-05](https://www.trustpilot.com/review/graphy.com#3)
- Link-in-bio service kept taking payments the creator never authorised, and its AI support bot claimed no account existed, forcing an ombudsman complaint. [other, 2026-09-25](https://www.trustpilot.com/review/linktr.ee#1)
- Even after recovering a hijacked channel, the creator is stuck in a monetization linking loop that live chat agents cannot resolve. [forum, 2026-09-22](https://support.google.com/youtube/thread/469228345/step-2-stuck-in-adsense-website-review-loop-after-channel-recovery)
- Unresponsive payment platform support caused an Indian organiser event promotion and ticket sales to fail. [other, 2025-02-19](https://www.trustpilot.com/review/instamojo.com#3)

**Why now:** Creator and payment services moved most support to AI chatbots in 2025, and voice agents can now make escalation calls on someone's behalf.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P125 · Stuck in monetization review with nobody to ask

Creators who cross the monetization thresholds can wait months in review, see a viral short left out of their eligibility count, and watch an earnings page that lags by days. Nobody explains which rule is holding them back, so they keep uploading blind while income they qualified for stays out of reach.

**Challenge:** Tell a creator exactly where their monetization stands and what to fix next, in plain words, in under a minute.

Legendary · for creators · global · teaches Data and dashboards, AI agents · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- After overhauling content to fix a rejection, a creator has waited over eleven weeks for a monetization re-review with no timeline from support. [forum, 2026-10-06](https://support.google.com/youtube/thread/471562527/ypp-re-application-pending-11-weeks-%E2%80%94-requesting-pe-escalation-case-id-6-5403000041503)
- A viral gaming Short with millions of views is not counted toward monetization eligibility, and the creator gets no explanation why. [forum, 2026-10-05](https://support.google.com/youtube/thread/471521250/shorts-views-not-counting-in-earn-tab-for-monetization)
- Creator studio earnings page shows days-old analytics with no way to refresh, so creators cannot track monetization progress. [appstore, 2026-07-30](https://apps.apple.com/in/app/youtube-studio/id888530356?see-all=reviews#1)

**Why now:** Short and long videos now count toward eligibility under different rules, and creator support has shifted toward automated replies, so the gap between what creators see and what counts keeps widening.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P137 · Payout dates that move without a reason

Expected payout dates slip by a full month, paid subscriber revenue fails to arrive, and Indian sellers wait on delayed payouts or see an account suspended the day before money is due, all without a reason shown. Creators who budget around these payments cannot plan rent, equipment or the next shoot.

**Challenge:** Show every creator when each rupee they have earned will land, and raise the alarm the day it slips.

Epic · for creators · India · teaches Data and dashboards, Automation and integrations, Payments · also Money

<details><summary>Evidence (4) and scores (24)</summary>

- Creator expected payout date silently slipped by a full month with no reason shown in the dashboard. [forum, 2026-10-06](https://support.google.com/youtube/thread/471571205/hello-i-have-a-question-regarding-my-upcoming-payment-previously-my-payment-was-showing)
- Indian creator selling digital products had the account suspended the day before payout, with no reason given and no reply from support. [other, 2026-08-23](https://www.trustpilot.com/review/gumroad.com#2)
- Newsletter author says paid subscriber revenue promised by the platform is not reaching them. [other, 2026-07-04](https://www.trustpilot.com/review/substack.com#2)
- Indian small seller faces delayed payouts from the payment link platform with no transparency and unhelpful support. [other, 2025-03-20](https://www.trustpilot.com/review/instamojo.com#1)

**Why now:** Creator income is spread across more services than ever in 2025 and 2026, and late or skipped payouts are now a common public complaint rather than a rare edge case.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P148 · Hijacked channels and a support desk that cannot help

When a creator account is hijacked, moved between owners or caught in a login loop, recovery options are already changed and support cannot restore access. A small media team can lose a channel it spent years building, along with the earnings attached to it.

**Challenge:** Get a locked-out creator back in control within days, and make the next takeover far harder to pull off.

Legendary · for creators · global · teaches Automation and integrations, Full-stack web · also Work

<details><summary>Evidence (3) and scores (24)</summary>

- Moving a channel to a shared brand account for a small media team broke access, and the owner fears losing the channel entirely. [forum, 2026-10-04](https://support.google.com/youtube/thread/471330284/youtube-channel-transfer-to-brand-account-is-not-working)
- Hacker changed all recovery options on a monetized creator account, and the creator cannot reach a human to recover channel and earnings. [forum, 2026-10-01](https://support.google.com/youtube/thread/470815188/urgent-google-account-hacked-and-monetized-adsense-youtube-hijacked)
- Creator stuck in a login loop while their paid link-in-bio account vanished, and support could not restore access. [other, 2026-09-07](https://www.trustpilot.com/review/linktr.ee#2)

**Why now:** Cookie-theft attacks aimed at creators grew through 2025, and recovery support is increasingly automated, so prevention and a ready evidence pack matter more than ever.

pain 5 · frequency 2 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 4

</details>

### P158 · Holding the licence and losing the dispute anyway

Creators who paid for music or used the official licensed library still get claims, unlisted videos and rejected disputes. Digital sellers with a clear no-refund policy still lose buyer disputes, because the proof they hold rarely reaches whoever decides.

**Challenge:** Make a creator's proof of rights impossible to ignore, attached and ready the moment a claim or dispute lands.

Legendary · for creators · global · teaches Automation and integrations, AI agents · also Money

<details><summary>Evidence (4) and scores (24)</summary>

- An audio claim hit a Short with hundreds of thousands of views, and the creator cannot swap the music without reposting and losing them. [forum, 2026-10-05](https://support.google.com/youtube/thread/471470844/i-have-got-an-audio-copyright-on-my-video-how-can-i-fix-it-without-reposting-as-we-have-450k-viwes)
- Videos get unlisted and lose views even when the creator used only the platform official licensed audio library. [forum, 2026-10-04](https://support.google.com/youtube/thread/471320638/video-getting-unlisted-despite-using-youtube-audio)
- Creator paid for a stock music licence, yet a Content ID claim stuck and the dispute was rejected despite showing the licence. [forum, 2026-10-04](https://support.google.com/youtube/thread/471366063/licensed-envato-track-claimed-by-content-id-dispute-rejected-need-help-removing-the-claim)
- Digital product seller lost money when buyers disputed purchases despite a stated no-refund policy, and the platform sided with the buyer. [other, 2025-10-27](https://www.trustpilot.com/review/gumroad.com#4)

**Why now:** Automated rights matching now covers short video too, and claim volumes rose as more creators use licensed music libraries.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P168 · Fake takedowns as a harassment weapon

Harassers and impostors file false copyright strikes and abuse reports against small creators, and the counter-notice process demands personal details that go straight to the attacker. Three strikes in a day can delete a channel, while reports of real stalking go unmoderated.

**Challenge:** Help a targeted creator answer false strikes and harassment fast, without handing their home address to the attacker.

Mythic · for creators · global · teaches AI agents, Full-stack web

<details><summary>Evidence (3) and scores (24)</summary>

- A harasser files fake takedowns against a small channel, and the counter-notice process forces the creator to reveal personal details to the attacker. [forum, 2026-10-04](https://support.google.com/youtube/thread/471321826/urgent-targeted-dmca-abuse-identity-fraud-by-emir-durden-forced-to-doxx-myself)
- Gaming creator got three copyright strikes in a day from an impostor posing as a game publisher via a free email address, risking channel deletion. [forum, 2026-10-03](https://support.google.com/youtube/thread/471252154/fraudulent-copyright-strikes-from-imposter-impersonating-ncsoft-using-free-gmail-account)
- Newsletter writer faces persistent cyberstalking on the platform, and harassment reports are not moderated adequately. [other, 2026-09-18](https://www.trustpilot.com/review/substack.com#1)

**Why now:** Impostor takedowns sent from free email addresses rose with automated enforcement, and the counter-notice rules still expose personal details.

pain 5 · frequency 2 · willingness 2 · buildability 3 · learning 3 · novelty 4 · openness 5

</details>

### P178 · Freelance editors sitting out the generative video boom

Freelance video editors working from phones find free editors lack the blending, grading and transitions that paid client work needs, and an expired trial can lock a finished project away from export. Designers worried about being replaced by AI rarely use it to build work of their own, even though shipping has never been easier.

**Challenge:** Help a freelance editor deliver client-grade video with generative tools on a student's budget.

Epic · for creators · global · teaches Vision, AI agents · also Work

<details><summary>Evidence (3) and scores (24)</summary>

- Trial ended early and the editing app refused even temporary access to export a finished project, holding the creator work hostage. [other, 2026-09-21](https://www.trustpilot.com/review/capcut.com#3)
- Indian video editor finds the free creator app lacks blending modes, colour grading and transitions needed for professional work. [appstore, 2025-07-08](https://apps.apple.com/in/app/edits-an-instagram-app/id6738967378?see-all=reviews#4)
- Designers worried about AI replacing them rarely start companies, though shipping products has never been easier. [yc, 2025-05-08](https://www.ycombinator.com/rfs#summer-2025-more-design-founders)

**Why now:** Generative image and video tools became realistic and affordable in 2025, and freelancers who adopt them early can win work that used to need a studio.

pain 3 · frequency 3 · willingness 3 · buildability 3 · learning 5 · novelty 4 · openness 3

</details>

### P187 · Translation is either eight hours or wrong

Creators and small publishers working in less common languages get auto-captions they cannot remove and machine translations that still need line-by-line checking. Agencies are overkill for small jobs, so a single file can take eight hours by hand or go out wrong.

**Challenge:** Get a small publisher's video or page into another language, accurately and checked, in under an hour.

Rare · for creators · global · teaches Voice AI, AI agents · also Work

<details><summary>Evidence (3) and scores (24)</summary>

- Creator in a niche language cannot remove wrong auto-generated captions after a studio update, even after uploading correct manual subtitles. [forum, 2026-09-30](https://support.google.com/youtube/thread/470652932/unable-to-delete-auto-generated-subtitles-with-recent-youtube-studio-update)
- A website owner spent eight or more hours per file on manual translation to reach international readers. [hn, 2025-09-29](https://news.ycombinator.com/item?id=45412596)
- Running a multilingual website, occasional small translation jobs are awkward: agencies are overkill and machine output needs checking. [hn, 2025-07-16](https://news.ycombinator.com/item?id=44582372)

**Why now:** Speech and translation models became strong in Indian and other low-resource languages through 2025, so a checked translation can be fast and cheap.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P195 · Brands cannot find the real creator

Over half of surveyed Indian creators lost brand deals because brands had no verified way to reach them, while impostor managers quote double rates in their name. Brands walk away from deals the creator never knew existed, and a founder who interviewed six hundred creators found the deal admin pain real.

**Challenge:** Make it impossible for a brand to reach a fake manager instead of the creator it actually wants.

Legendary · for creators · India · teaches Full-stack web, Automation and integrations

<details><summary>Evidence (3) and scores (24)</summary>

- Founder contacted 600 creators about a brand-deal management tool and found the pain real but not painful enough to pay for. [hn, 2025-12-30](https://news.ycombinator.com/item?id=46428771)
- Over half of surveyed Indian creators lost brand deals because brands had no clear, verified way to contact them directly. [news, 2025-05-28](https://www.storyboard18.com/brand-marketing/55-creators-lost-brand-deals-due-to-unclear-and-unverified-way-for-brands-to-contact-them-hashfame-67632.htm#1)
- Fake talent managers impersonate creators and double their quoted rates, so brands walk away from deals the creator never knew existed. [news, 2025-05-28](https://www.storyboard18.com/brand-marketing/55-creators-lost-brand-deals-due-to-unclear-and-unverified-way-for-brands-to-contact-them-hashfame-67632.htm#2)

**Why now:** Brands in India now go direct to creators instead of agencies, which made impostor managers a real and growing risk.

pain 4 · frequency 3 · willingness 2 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P203 · Course creators who rent their whole business

Independent course creators pay for hosted course businesses, then see promised setup never arrive and email open rates collapse after a silent sender change. Their videos, students and mailing list all sit with one provider, so a single decision upstream can wipe out the business.

**Challenge:** Let an independent educator move their courses, students and emails anywhere in a day, and know the moment something breaks.

Legendary · for creators · global · teaches Automation and integrations, Full-stack web · also Education

<details><summary>Evidence (3) and scores (24)</summary>

- Course platform changed the creator sender domain without notice and email open rates collapsed from about 30 to under 10 percent. [other, 2026-08-22](https://www.trustpilot.com/review/kajabi.com#1)
- Indian creator paid for a course platform package but the promised website setup and marketing support never arrived. [other, 2026-08-15](https://www.trustpilot.com/review/graphy.com#2)
- People whose mail, files and photos all sit with one provider fear being locked out and losing everything. [hn, 2025-12-29](https://news.ycombinator.com/item?id=46423478)

**Why now:** Course hosts raised prices and changed terms through 2025, and more Indian educators sell courses directly, raising the cost of lock-in.

pain 4 · frequency 3 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 4

</details>

### P211 · No copy of the work, nor of the fans

Creators lose uploaded course videos to a server crash, and long-time membership accounts are terminated with no way to recover content or member lists. Cloud services make it hard to download everything, so people discover they never owned a copy only after it is gone.

**Challenge:** Keep a complete, usable copy of everything a creator has made and every fan they have, without them thinking about it.

Legendary · for creators · global · teaches Automation and integrations, Data and dashboards

<details><summary>Evidence (3) and scores (24)</summary>

- Indian course creator lost uploaded videos permanently after a server crash on the course platform, with no recovery offered. [other, 2026-09-26](https://www.trustpilot.com/review/graphy.com#1)
- Long-time creator membership account was terminated instantly with no option to recover their content or member data. [other, 2026-09-17](https://www.trustpilot.com/review/patreon.com#1)
- Cloud photo backup re-adds photos people deleted and offers no easy way to download everything. [hn, 2026-04-10](https://news.ycombinator.com/item?id=47714136)

**Why now:** Account terminations and service shutdowns hit creators repeatedly in 2025, and most services now offer export interfaces that can be scheduled.

pain 5 · frequency 2 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P218 · Tiny ad budgets burned in a week

Independent makers and small brands with tiny budgets find paid ads expensive and ineffective, and lack the time or skill to keep tuning low-budget campaigns. Money goes out every week with no clear sign of what worked.

**Challenge:** Make ₹5,000 of ads teach a small seller something they can act on next week.

Rare · for creators · global · teaches Data and dashboards, AI agents, Automation and integrations · also Retail

<details><summary>Evidence (3) and scores (24)</summary>

- Small brands waste ad spend because they lack time and expertise to keep tuning low-budget search campaigns. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#MqqUOBV8I)
- Builders with no marketing budget struggle to get anyone to notice a finished project. [hn, 2025-05-21](https://news.ycombinator.com/item?id=44051755)
- Small app makers find paid ads expensive and ineffective when their audience is broad and hard to target. [hn, 2025-05-21](https://news.ycombinator.com/item?id=44052663)

**Why now:** Ad networks automated targeting through 2025, which helps big spenders but leaves small budgets with less control and less feedback.

pain 3 · frequency 4 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P223 · Paid posts dressed up as honest opinion

About two thirds of influencer ads checked in India failed disclosure rules, and some paid posts are deleted after the campaign so nobody can check. Followers cannot tell ads from opinions, and some end up paying scam creator profiles with no way to get the money back.

**Challenge:** Let a follower check in seconds whether a creator's post was paid for and who paid.

Legendary · for consumers · India · teaches Vision, Mobile apps · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- Fan paid a scam creator profile on a membership platform, and the refund was rejected without any human review. [other, 2026-10-01](https://www.trustpilot.com/review/patreon.com#2)
- Brands and influencers allegedly post paid content without disclosure and delete it later, leaving audiences unable to tell ads from opinions. [news, 2026-05-28](https://www.indiantelevision.com/mam/influencers-under-the-lens-as-asci-flags-brands-over-hidden-ads/)
- About two thirds of influencer ads checked in India failed disclosure rules, exposing brands and creators to regulatory action. [news, 2025-05-28](https://www.moneycontrol.com/news/trends/asci-flags-widespread-influencer-ad-violations-including-linkedin-sounds-alarm-on-betting-ads-13055393.html)

**Why now:** India's advertising standards body tightened influencer disclosure rules and stepped up checks, and phone screenshots can now be read reliably by vision models.

pain 3 · frequency 4 · willingness 2 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P228 · Shipping is easy, being found is not

Software has become fast and cheap to build, but solo founders launch to a handful of likes and have no repeatable way to reach buyers. Marketing feels alien to them, and even new consumer AI products have struggled to reach ordinary people beyond chat assistants.

**Challenge:** Get a solo founder's new product in front of its first hundred real users in two weeks.

Rare · for businesses · global · teaches AI agents, Automation and integrations · also Work

<details><summary>Evidence (5) and scores (24)</summary>

- Three years into the AI shift, few new consumer products built on it have reached ordinary people beyond chat assistants. [yc, 2026-07-22](https://www.ycombinator.com/rfs#fall-2026-ai-powered-consumer-products-for-1-billion-people)
- Solo founders say reaching the right audience is the hardest part of building a business. [hn, 2026-04-22](https://news.ycombinator.com/item?id=47869868)
- Shipping software is now fast but nobody finds new products; distribution is the real wall for small makers. [hn, 2026-04-20](https://news.ycombinator.com/item?id=47834851)
- Solo technical founders launch products to a handful of likes and lack any repeatable way to reach buyers. [hn, 2026-04-06](https://news.ycombinator.com/item?id=47667504)
- Developers launching their own products find marketing alien and do not know where to begin. [hn, 2025-12-17](https://news.ycombinator.com/item?id=46299780)

**Why now:** AI coding tools made building nearly free by 2025, so the number of new products exploded while attention did not.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P233 · Reach that drops to zero with no explanation

Short videos that used to reach tens of thousands now sit at zero, second posts in a day get a fraction of the first, and accepting a collaboration post can cut reach sharply. Creators cannot tell which choice caused the drop, so they change everything at once and learn nothing.

**Challenge:** Show a creator which of their own choices moved reach this week, using only their own numbers.

Rare · for creators · global · teaches Data and dashboards, Mobile apps

<details><summary>Evidence (3) and scores (23)</summary>

- Shorts that used to get tens of thousands of views now sit at zero, with no feed traffic and no explanation for five days. [forum, 2026-10-06](https://support.google.com/youtube/thread/471563721/youtube-shorts-getting-0-views-and-no-shorts-feed-traffic)
- Second and third Shorts posted in a day get a fraction of the first one reach, and the creator cannot tell why distribution throttles. [forum, 2026-10-05](https://support.google.com/youtube/thread/471532977/my-channel-has-suddenly-lost-shorts-reach-and-views-please-check-if-there-is-a-distribution-issue)
- Indian creator finds Reel reach drops sharply whenever they accept a collaboration post with another account. [appstore, 2024-09-18](https://apps.apple.com/in/app/instagram/id389801252?see-all=reviews#1)

**Why now:** Short-video feeds changed distribution rules several times in 2025, and creators now post more often across several services, making cause and effect harder to read.

pain 3 · frequency 5 · willingness 3 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P236 · Phone editors that eat a creator's work

Short-video editors on phones lose drafts when redo fails, drop edits when several overlays stack and freeze on export. The saved file sometimes does not even match the edit, so hours of work vanish right before posting.

**Challenge:** Make sure no creator ever loses a finished edit, whatever happens to the editor on their phone.

Epic · for creators · India · teaches Mobile apps, Vision

<details><summary>Evidence (3) and scores (23)</summary>

- Video editor auto-captions broke and exports froze, with the saved video not matching the edits the creator had made. [other, 2026-09-24](https://www.trustpilot.com/review/capcut.com#1)
- Edits vanish within seconds when stacking several overlays, and processing takes so long the creator gives up. [appstore, 2026-01-16](https://apps.apple.com/in/app/edits-an-instagram-app/id6738967378?see-all=reviews#2)
- Indian Reels creator loses editing progress because redo fails and draft recovery does not work in the short-video editor. [appstore, 2025-12-31](https://apps.apple.com/in/app/edits-an-instagram-app/id6738967378?see-all=reviews#1)

**Why now:** Short video is the main format for Indian creators, most of whom edit on mid-range phones, and server-side rendering got cheap enough in 2025 to offload heavy work.

pain 4 · frequency 4 · willingness 3 · buildability 3 · learning 4 · novelty 2 · openness 3

</details>

### P238 · Self-promotion treated as spam

Independent makers and writers who share their own work in online communities get flagged as spammers unless they are long-standing members, and spam filters block them from linking to their own sites. The people with the most reason to talk about their work are the ones the rules silence.

**Challenge:** Help an independent maker earn a community's trust fast enough to share their work there within a month.

Epic · for creators · global · teaches AI agents, Full-stack web · also Work

<details><summary>Evidence (3) and scores (23)</summary>

- Spam filters block a newsletter writer from linking to their own site or external work, hurting promotion. [other, 2026-07-01](https://www.trustpilot.com/review/substack.com#3)
- Indie makers find that promoting in online communities is treated as spam unless they are long-standing members. [hn, 2025-05-21](https://news.ycombinator.com/item?id=44054021)
- Indie game makers struggle to get traction on social channels without breaking community self-promotion rules. [hn, 2025-05-21](https://news.ycombinator.com/item?id=44052798)

**Why now:** AI-generated posts flooded communities in 2025, so moderators tightened self-promotion rules just as more people started shipping their own work.

pain 3 · frequency 4 · willingness 2 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P240 · Scheduled posts that quietly never go out

Small businesses pay for social scheduling services that drop tags, lose account connections and fail to publish, then trap them in annual plans with only chatbots to complain to. Owners who never use social media themselves get no traction and cannot even trust that planned posts went out.

**Challenge:** Give a small business a month of posts that go out on time, every time, with proof that they did.

Rare · for businesses · global · teaches Automation and integrations, Mobile apps · also Work, Retail

<details><summary>Evidence (6) and scores (23)</summary>

- Small business was charged a large annual fee for a social scheduling tool right after its trial and refused a refund despite same-day cancellation. [other, 2026-10-02](https://www.trustpilot.com/review/later.com#1)
- Small business double-charged by a social scheduling tool could reach only AI chatbots, never a person, to fix billing. [other, 2026-08-26](https://www.trustpilot.com/review/later.com#3)
- Scheduling tool marketed as automation still required many manual steps per post, eating the time it promised to save. [other, 2026-07-28](https://www.trustpilot.com/review/buffer.com#2)
- Social scheduling tool failed to publish reliably and dropped tags, so a business could not trust its planned posts went out. [other, 2026-07-02](https://www.trustpilot.com/review/buffer.com#1)
- Social scheduler kept losing its Instagram connection and was buggy, yet the user could not get the annual plan refunded. [other, 2026-06-27](https://www.trustpilot.com/review/later.com#2)
- A small business owner who does not use social media personally cannot get any traction promoting a product there, as organic reach shrinks. [hn, 2026-06-08](https://news.ycombinator.com/item?id=48448825)

**Why now:** Social networks changed their publishing interfaces repeatedly through 2025, breaking connections, while owners expect posting to run itself.

pain 3 · frequency 5 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 2

</details>

### P242 · Paying for followers who were never there

Indian brands that now hire creators directly, without agencies, keep paying for audiences that look large but never buy. Nearly three quarters cite fake followers as a major challenge, and first-time founders on small budgets cannot tell whether a campaign worked.

**Challenge:** Tell a small brand, before it pays, whether a creator's audience is real and likely to buy.

Epic · for businesses · India · teaches Data and dashboards, Vision · also Retail

<details><summary>Evidence (4) and scores (23)</summary>

- A Mumbai skincare founder paid a creator with lakhs of followers for four Reels; reach looked fine but sales never followed, suggesting a hollow audience. [news, 2026-07-14](https://www.mid-day.com/buzz/article/check-fake-instagram-followers-before-signing-a-creator-how-ai-fraud-detection-works-in-2026-10270)
- First-time founders running small ad budgets cannot tell whether a campaign is actually working. [hn, 2026-06-26](https://news.ycombinator.com/item?id=48681029)
- Indian D2C brands are dropping agencies to work with creators directly for cost reasons, taking on discovery, negotiation and management themselves. [news, 2026-03-20](https://www.exchange4media.com/influence-zone-news/cutting-out-agencies-going-direct-are-d2c-brands-rewriting-influencer-marketing-rules-153059.html)
- Nearly three quarters of brands cite fake followers as a major challenge when picking influencers in India. [news, 2025-06-12](https://www.livemint.com/news/fake-followers-and-murky-return-astatine-ai-investment-pushes-brands-rejig-influencer-strategy-youtube-wow-plum-goodness-11749725710153.html#1)

**Why now:** Indian D2C brands moved creator work in-house in 2025, so the vetting an agency used to do now falls on founders without the tools.

pain 4 · frequency 3 · willingness 4 · buildability 3 · learning 4 · novelty 2 · openness 3

</details>

### P244 · A calm media diet nobody curates

People hunt for focus music through ads and endless playlists, struggle to stay informed without the stress of the news cycle, and lack an easy way to listen to saved articles. Book recommendations rarely match their taste, and cheap generative media has not yet become something they use every day.

**Challenge:** Give someone a daily mix of reading, news and listening that fits their taste and leaves them calmer, not more anxious.

Rare · for consumers · global · teaches Voice AI, Mobile apps

<details><summary>Evidence (5) and scores (22)</summary>

- Readers struggle to find book recommendations that genuinely match their own tastes. [hn, 2026-03-27](https://news.ycombinator.com/item?id=47539870)
- People overwhelmed by the constant news cycle want to stay informed without the stress and noise. [hn, 2025-12-21](https://news.ycombinator.com/item?id=46345011)
- With a popular read-later service shut down, people lack an easy way to save long articles and listen to them as audio. [hn, 2025-08-04](https://news.ycombinator.com/item?id=44783867)
- Video generation is becoming cheap and realistic, yet few products turn it into something people use every day. [yc, 2025-07-30](https://www.ycombinator.com/rfs#fall-2025-video-generation-primitive)
- Workers waste time hunting for suitable focus music, interrupted by ads and endless playlist browsing. [hn, 2025-06-25](https://news.ycombinator.com/item?id=44380690)

**Why now:** Text-to-speech became natural and cheap in 2025, and a well-known read-later service shut down, leaving its users looking for a new home.

pain 2 · frequency 5 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 2

</details>

## Travel and mobility

### P004 · Cab drivers accept trips blind and earn below cost

Drivers cannot see whether a trip is long or short before accepting, fares no longer cover running costs on hot days, and fees and penalties take close to 40 percent. Broken buttons and penalties for cancellations they did not cause cut earnings further.

**Challenge:** Show a driver, before accepting, whether a trip will make or lose money after fuel and fees.

Legendary · for creators · India · teaches Data and dashboards, Mobile apps, Voice AI · also Work, Money

<details><summary>Evidence (5) and scores (28)</summary>

- Bike-taxi captain keeps losing rating points for cancellations the customer initiated, with no way to get them reversed. [forum, 2025-07-16](https://www.consumercomplaints.in/rapido-complaint-regarding-unfair-rating-deduction-due-to-customer-initiated-cancellations-c3532023)
- Cab drivers say platform fees and penalties take nearly 40 percent of fares; new daily subscriptions feel like rebranded commission. [news, 2025-06-27](https://inc42.com/features/ola-uber-the-zero-commission-u-turn/)
- Driver app's trip-match button stopped working on iPhones and stayed broken across updates, costing drivers ride requests. [appstore, 2025-03-03](https://apps.apple.com/in/app/uber-driver-drive-deliver/id1131342792?see-all=reviews&platform=iphone#1)
- Cab driver says app fares no longer cover running costs like air-conditioning fuel through long hot days. [appstore, 2024-05-04](https://apps.apple.com/in/app/uber-driver-drive-deliver/id1131342792?see-all=reviews&platform=iphone#3)
- Drivers cannot see whether a trip is long or short before accepting, making daily earnings hard to plan. [appstore, 2024-03-01](https://apps.apple.com/in/app/uber-driver-drive-deliver/id1131342792?see-all=reviews&platform=iphone#4)

**Why now:** In 2025 ride services in India moved drivers to daily subscriptions, which changed the maths of every trip.

pain 5 · frequency 5 · willingness 3 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P016 · Women plan every late trip around fear

Women returning late avoid autos and cabs, solo travellers fear getting lost or stuck, and families avoid parks they cannot judge as safe. Drivers misbehave or go the wrong way with little recourse, and safety checks like ride PINs never change.

**Challenge:** Let a woman travelling late know her route is safe, and get help in seconds when it is not.

Epic · for consumers · India · teaches Mobile apps, Voice AI, AI agents · also Health

<details><summary>Evidence (6) and scores (26)</summary>

- Bike-taxi app ride PIN never changes between trips, weakening the safety check meant to confirm the right rider and driver. [x, 2026-02-09](https://x.com/beastoftraal/status/2020725298485157956)
- Women joggers and families avoid neighbourhood parks over safety worries, with no shared way to judge which are safe. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#cu6CCMVzm)
- Women returning late at night avoid autos and cabs over safety concerns, with few trustworthy alternatives. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#tQ5gr9U_Z)
- Solo women travellers worry about getting lost, harassed or stuck in an emergency in unfamiliar cities. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ZRo92uKks)
- Ride-app cab driver behaved abusively and drove unsafely; rider had little recourse through in-app support. [forum, 2025-09-01](https://www.consumercomplaints.in/rapido-complaint-against-cab-driver-for-misconduct-and-safety-violation-c3534193)
- Driver took the wrong direction instead of the railway station, putting the passenger's train connection at risk. [forum, 2025-05-08](https://www.consumercomplaints.in/rapido-urgent-complaint-regarding-misleading-route-taken-by-driver-on-3rd-may-2025-c3530821)

**Why now:** Smartphone location and voice triggers are good enough to detect a wrong turn and alert family without touching the phone.

pain 5 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P028 · Car hosts lose their income to unsettled claims

People who rent out their car through sharing marketplaces wait months or a year for damage, seizure or total-loss payouts while the car sits idle. New drivers wait days for activation with no way to fix a rejected document.

**Challenge:** Help a car host or driver build a claim the marketplace cannot ignore, and track it to payment.

Mythic · for creators · India · teaches AI agents, Vision, Automation and integrations · also Money

<details><summary>Evidence (5) and scores (25)</summary>

- Car host whose vehicle was seized during a renter's trip still awaits platform reimbursement nearly a year later. [forum, 2026-08-25](https://www.consumercomplaints.in/zoomcar-complaint-against-zoomcar-india-pvt-ltd-non-payment-of-reimbursement-and-prolonged-delay-c3544308)
- Host's car, their only income source, sits idle after a renter's legal case while platform payment stays unreleased. [forum, 2026-06-02](https://www.consumercomplaints.in/zoom-car-court-fine-of-exercise-act-and-total-rent-of-car-related-issues-c3542302)
- Car-sharing host got vehicle back heavily damaged and the platform has not acknowledged or settled the damage claim. [forum, 2026-03-18](https://www.consumercomplaints.in/zoomcar-regarding-damage-claimrefund-c3540096)
- Host has waited a year for total-loss payout on a wrecked rental car amid repeated broken promises. [forum, 2026-02-11](https://www.consumercomplaints.in/zoomcar-immediate-release-of-pending-payment-required-2592098total-loss-wb12aw2221-jpsno16hv-c3539349)
- New driver waited six days for account activation and could not edit a rejected document, so could not start earning. [appstore, 2025-01-23](https://apps.apple.com/in/app/uber-driver-drive-deliver/id1131342792?see-all=reviews&platform=iphone#2)

**Why now:** Peer car sharing grew in India in 2024 and 2025 and complaints about stuck host payouts grew with it.

pain 5 · frequency 2 · willingness 3 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P040 · When the bus does not come, nobody finds another

Booked intercity buses get cancelled a day before or never reach the boarding point, and passengers are not told. The booking service offers no alternate bus and no status on a refund.

**Challenge:** When a bus is cancelled, get the passenger onto another one before they reach the stop.

Legendary · for consumers · India · teaches AI agents, Automation and integrations

<details><summary>Evidence (3) and scores (25)</summary>

- Bus cancelled a day before travel with no notice to the passenger and no alternative arranged. [other, 2026-10-02](https://www.trustpilot.com/review/www.redbus.in#1)
- Booked intercity bus never showed up and support gave no status on refund afterwards. [forum, 2026-06-03](https://www.consumercomplaints.in/redbus-bus-didnt-arrive-and-no-updates-on-refund-c3542330)
- Bus never reached the boarding point and the booking platform offered no alternate bus or help. [forum, 2025-12-16](https://www.consumercomplaints.in/redbus-formal-complaint-against-redbus-fraudulent-activity-with-sangitam-travels-c3538027)

**Why now:** Bus inventories are now online across operators, making automated rebooking possible.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P052 · Paid hotel bookings the hotel never heard of

Travellers arrive with a paid voucher to find the hotel has no record, no room, or the wrong number of guests. Booking sites and hotel inventory are out of sync, and the traveller pays twice or sleeps elsewhere.

**Challenge:** Make sure a hotel knows about a paid booking before the guest arrives.

Epic · for consumers · India · teaches Voice AI, AI agents, Automation and integrations

<details><summary>Evidence (4) and scores (25)</summary>

- Corporate hotel booking recorded one guest instead of four, forcing a large surcharge at the property with no fix. [other, 2026-08-31](https://www.trustpilot.com/review/navan.com#4)
- Traveller paid an OTA and received a hotel confirmation, but the hotel had no record of the booking on arrival. [forum, 2026-08-26](https://www.consumercomplaints.in/cleartrip-booking-of-hotel-done-hotel-actually-not-booked-even-after-paying-advance-c3544333)
- Fully paid hotel voucher from booking site was not recognised by hotel management at check-in. [forum, 2026-07-09](https://www.consumercomplaints.in/cleartrip-cleartrip-hotel-booking-scam-c3543211)
- Hotel booked and paid via OTA had no room at check-in; platform and property inventory were out of sync. [forum, 2026-04-17](https://www.consumercomplaints.in/make-my-trip-payment-deducted-by-mmt-but-room-not-allotted-by-ibis-aerocity-nh73043478751610-c3540911)

**Why now:** Voice agents can now call a hotel desk in a local language for a few rupees.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 4 · openness 3

</details>

### P064 · Nobody knows what a ride costs until it ends

Final cab fares come out far above the upfront quote, sometimes four times the estimate, with charges added only at trip end. Riders who end early still pay the full fare, and auto fares on ride services now sit above the meter rate.

**Challenge:** Tell a rider before booking what this trip should really cost, and flag when they are overcharged.

Epic · for consumers · India · teaches Data and dashboards, Full-stack web, AI agents · also Money

<details><summary>Evidence (5) and scores (24)</summary>

- Rider ended trip early at an intermediate stop but was still billed the full fare to final destination. [forum, 2026-01-15](https://www.consumercomplaints.in/uber-india-regarding-charges-for-unused-services-c3538769)
- Final cab fare came out far above the quoted upfront fare with an unexplained deferred charge. [forum, 2025-11-17](https://www.consumercomplaints.in/uber-india-overcharge-and-unauthorized-payment-for-trip-on-november-17-2025-c3537037)
- Survey: 59 percent of app-taxi users face charges added only at trip end; most see misleading wait times and hidden cancel buttons. [news, 2025-11-12](https://www.localcircles.com/a/press/page/taxi-aggregator-drip-pricing)
- Cab rider charged roughly four times the estimated fare range for the same route with no explanation. [forum, 2025-07-25](https://www.consumercomplaints.in/uber-india-unjustified-fare-c3533908)
- Bengaluru auto fares on ride apps have crept above the meter rate once subsidies ended; riders now hunt for drivers willing to use meter. [x, 2025-06-22](https://x.com/FI_InvestIndia/status/1936742036700639563)

**Why now:** Surveys in 2025 found most ride-hailing users facing charges added at trip end, and new rules cap surge pricing.

pain 3 · frequency 5 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P076 · Drivers cancel the moment they see your destination

Most ride-hailing users face driver cancellations after drivers learn the destination or payment mode, and airport bookings get stuck in accept-then-cancel cycles. Riders miss flights and early-morning trips, and a small credit does not cover it.

**Challenge:** Get a rider to the airport on time even when three drivers cancel in a row.

Epic · for consumers · India · teaches Data and dashboards, Automation and integrations, Mobile apps

<details><summary>Evidence (5) and scores (24)</summary>

- Early-morning airport ride was cancelled when no driver was found, and the small app credit did not cover the missed trip. [other, 2026-10-06](https://www.trustpilot.com/review/uber.com#1)
- Survey: 82 percent of app-taxi users faced driver cancellations, often after drivers learn destination or digital payment; cancellation charges nearly doubled. [news, 2026-08-03](https://www.business-standard.com/india-news/app-taxi-users-back-maharashtra-style-penalty-for-driver-cancellations-126080300462_1.html)
- Airport cab bookings get stuck in repeated accept-then-cancel cycles, wasting time travellers do not have. [x, 2025-08-30](https://x.com/gus_brf/status/1961731235371511970)
- Rider waited over 20 minutes for an allotted driver who then refused the trip. [forum, 2025-01-21](https://www.consumercomplaints.in/rapido-complaint-against-rapido-driver-for-unprofessional-behavior-c3527838)
- Survey: 84 percent of app-taxi users hit cancellations over destination or cash; surge pricing and long waits also widespread. [news, 2024-01-16](https://www.localcircles.com/a/press/page/taxi-aggregators-survey)

**Why now:** Surveys in 2025 put driver cancellations above 80 percent of ride-hailing users, and new rules introduced penalties for them.

pain 4 · frequency 5 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P088 · Airline refunded weeks ago, the traveller is still waiting

Airlines release refunds to booking agents who sit on them for weeks, leaving travellers out of pocket on cancelled and connecting flights. Train passengers see delay refunds rejected on technicalities.

**Challenge:** Chase every refund a traveller is owed until it lands, without them writing a single email.

Epic · for consumers · India · teaches Automation and integrations, AI agents, Data and dashboards · also Money

<details><summary>Evidence (5) and scores (24)</summary>

- Connecting flight cancelled by airline, yet the OTA has not refunded the whole one-way journey weeks later. [forum, 2026-09-07](https://www.consumercomplaints.in/cleartrip-flight-is-cancelled-but-refund-is-not-done-c3544597)
- Airline already released refund for cancelled flight but the OTA has not passed the money on to traveller. [forum, 2026-06-09](https://www.consumercomplaints.in/makemytrip-makemytrip-is-not-refunding-my-cancelled-indigo-flight-money-c3542499)
- Flight booking refunds from an OTA arrive very late despite traveller paying full fare upfront. [forum, 2026-06-05](https://www.consumercomplaints.in/ease-my-trip-flight-bookings-c3542388)
- Refund request for a refundable international air ticket booked on an OTA went unprocessed weeks later. [forum, 2026-06](https://www.consumercomplaints.in/goibibo-com-non-processing-of-refund-on-cancellation-of-air-ticket-c3542669)
- Train refund claims for 3-plus hour delays are often rejected on technicalities, leaving passengers without a valid route to their money. [x, 2024-11-26](https://x.com/trainwalebhaiya/status/1861378247944269843)

**Why now:** Language models can now read a messy inbox of booking and refund mails and track each case.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P100 · The bus moved and nobody told the passenger

Intercity buses change pickup points by phone, run hours late or leave while booked passengers are minutes away. Live tracking and driver contact numbers are often wrong, so passengers miss buses and lose the fare.

**Challenge:** Make sure every passenger knows where and when their bus really is, before they leave home.

Epic · for consumers · India · teaches Mobile apps, Automation and integrations, Voice AI

<details><summary>Evidence (4) and scores (23)</summary>

- Private bus left the boarding point while booked passenger was minutes away; no live coordination between operator, driver and traveller. [forum, 2026-10-03](https://www.consumercomplaints.in/redbus-bus-flew-away-without-waiting-c3545247)
- Intercity bus ran 2.5 hours late and passengers were never told the schedule had changed. [other, 2026-10-01](https://www.trustpilot.com/review/www.redbus.in#2)
- Bus crew changed the pickup spot over the phone without clear notice, leaving passenger confused about where to board. [forum, 2026-07-19](https://www.consumercomplaints.in/red-bus-driver-approach-c3543431)
- Bus tracking location and driver contact in the app were wrong, traveller missed bus and refund was refused. [forum, 2026-05-04](https://www.consumercomplaints.in/redbus-decline-to-refund-c3541405)

**Why now:** Private intercity buses carry a large share of Indian travel, and phones are now in every crew member's hand.

pain 4 · frequency 4 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P112 · Booking sites keep a cut of your airline refund

Online travel agents keep convenience fees after the airline cancels, deduct coupons without warning and pass on less than the airline refunded. Extra sums appear after payment, and near-identical cases get different refund rules.

**Challenge:** Show a traveller exactly what the airline refunded and make sure all of it reaches them.

Epic · for consumers · India · teaches Full-stack web, Data and dashboards, AI agents · also Money

<details><summary>Evidence (6) and scores (23)</summary>

- Traveller was quoted one flight price, paid, then told an extra sum was owed after the payment went through. [other, 2026-10-05](https://www.trustpilot.com/review/www.booking.com#3)
- Travel portal kept its convenience fee after flight booking was cancelled; traveller wants the fee refunded. [forum, 2026-09-06](https://www.consumercomplaints.in/makemy-trip-complaint-regarding-non-refund-of-convenience-fee-booking-id-an72ak8zu5872258927-c3544575)
- OTA applied different refund rules to near-identical airline reschedule cases, leaving travellers unsure what they are owed. [forum, 2026-05-13](https://www.consumercomplaints.in/cleartrip-com-urgent-escalation-regarding-different-refund-policies-for-rescheduled-flights-c3541676)
- Airline refunded the OTA in full for a cancelled flight but the traveller received about 1,750 rupees less. [forum, 2026-04-30](https://www.consumercomplaints.in/cleartrip-request-for-full-refund-against-pnr-jfdche-c3541307)
- OTA deducted a large amount from the airline refund citing a coupon used at booking, without clear prior disclosure. [forum, 2026-04-12](https://www.consumercomplaints.in/make-my-trip-unfair-deduction-c3540779)
- OTA refused to return its convenience fee even though the airline itself cancelled the flight. [forum, 2025-12-13](https://www.consumercomplaints.in/cleartrip-no-refundable-convenience-fee-c3537917)

**Why now:** Indian aviation regulators moved in 2025 to tighten refund rules for tickets bought through agents.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P124 · Travel add-ons sold at checkout, denied at the counter

Flexible fares, free-cancellation add-ons, bundled insurance and baggage allowances are sold at checkout and then not honoured. Travellers are marked no-show instead of rebooked and lose the payment.

**Challenge:** Tell a traveller, before they pay, exactly what each add-on will and will not cover.

Epic · for consumers · India · teaches AI agents, Full-stack web · also Money

<details><summary>Evidence (5) and scores (23)</summary>

- Traveller could not modify a flexible airline ticket on a booking site and lost the payment after failed change attempts. [other, 2026-10-05](https://www.trustpilot.com/review/www.booking.com#1)
- Bundled travel insurance from booking site covered the wrong dates and support never answered. [forum, 2026-08-13](https://www.consumercomplaints.in/makemytrip-india-travel-insurance-which-was-covered-by-mmt-only-according-to-my-flight-c3544043)
- Paid-for flexible fare add-on was not honoured and booking was marked no-show instead of changed. [forum, 2026-04-21](https://www.consumercomplaints.in/makemytrip-com-premium-flex-fare-not-honoured-booking-marked-no-showbooking-id-an21ak97s3589254704-pnr-lekvrt-flight-thai-airasia-fd-3075-c3541011)
- Baggage allowance shown on the booking site was not actually included in the airline ticket issued. [forum, 2026-03-26](https://www.consumercomplaints.in/makemytrip-india-misleading-baggage-claim-c3540297)
- Free-cancellation add-on sold with a train ticket did not deliver the refund the terms seemed to promise. [forum, 2026-03-09](https://www.consumercomplaints.in/makemytrip-india-complaint-against-makemytrip-for-misleading-free-cancellation-and-refund-policy-c3539871)

**Why now:** India's dark-pattern guidelines named pre-ticked add-ons, and OTAs were asked to audit them in 2025.

pain 3 · frequency 3 · willingness 2 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P136 · Peer car rental runs on trust nobody can check

Self-drive renters are blacklisted without reason or appeal, verification stalls before trips, listings use fake registration numbers, and hosts fail to hand over cars. Deposits and damage refunds stay pending for months.

**Challenge:** Let a renter and a car owner verify each other and settle deposits without a third party.

Epic · for consumers · India · teaches Vision, Mobile apps, Full-stack web · also Money

<details><summary>Evidence (8) and scores (23)</summary>

- Car rental booked through a ride app was refused at the counter after a background check, then billed as a no-show. [other, 2026-10-02](https://www.trustpilot.com/review/uber.com#3)
- Self-drive rental user blacklisted with no explanation and unable to book for days; no route to appeal. [forum, 2026-09-25](https://www.consumercomplaints.in/zoomcar-i-have-been-blacklisted-on-zoomcar-for-no-reason-c3545052)
- Regular self-drive renter blacklisted without notice; emails and calls to support went unanswered. [forum, 2026-03-23](https://www.consumercomplaints.in/zoomcar-i-have-been-blacklisted-without-any-reason-c3540199)
- Manual licence and document verification stayed pending on a rental app despite a booking due the next day. [forum, 2025-11-07](https://www.consumercomplaints.in/zoomcar-verification-not-yet-done-c3536729)
- Peer-to-peer rental host did not hand over the booked car at the agreed time, leaving the renter stranded. [forum, 2025-08-12](https://www.consumercomplaints.in/zoomcar-host-not-being-able-to-provide-the-car-on-time-c3533419)
- Rental marketplace listing used a fake registration number; renter could not reach support about the fraud. [forum, 2025-07-17](https://www.consumercomplaints.in/zoomcar-fraud-listing-on-zoomcars-and-support-unresponsive-c3532045)
- Self-drive security deposit not returned even after the car was handed back without damage. [forum, 2025-07-04](https://www.consumercomplaints.in/zoomcar-refund-of-security-deposit-3000-c3531359)
- Damage-repair refund on a rental pending over three months despite submitted documents and repeated promises. [forum, 2025-06-28](https://www.consumercomplaints.in/zoomcar-zoomcar-refund-not-processed-even-after-3-months-false-promises-and-no-resolution-c3531014)

**Why now:** Vehicle registration data is publicly searchable in India, and phone photos can document condition at handover.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P147 · Riders pay the cancellation fee for the driver's cancellation

Drivers demand more than the fare, then cancel when the rider refuses, and the rider is charged the cancellation fee. Some take cash and mark the trip cancelled, so the rider pays twice.

**Challenge:** Make sure the person who cancels a ride is the one who pays for it.

Epic · for consumers · India · teaches Automation and integrations, AI agents · also Money

<details><summary>Evidence (4) and scores (22)</summary>

- App showed one fare, driver demanded nearly 50 percent more to come; rider cancelled and was charged a cancellation fee. [x, 2025-10-11](https://x.com/AdityaS35343606/status/1976833944659386874)
- Driver demanded more than app fare, cancelled when refused, and the rider was penalised with the cancellation charge. [x, 2025-10-06](https://x.com/PrajnaMishraT/status/1975177229907685643)
- Driver took cash for the trip then marked it cancelled, and the rider was hit with a cancellation fee too. [forum, 2025-09-14](https://www.consumercomplaints.in/uber-india-uber-levied-cancellation-charges-though-we-have-paid-cash-to-driver-c3534740)
- Driver insisted on extra cash over card fare, ride was cancelled, and rider was charged the cancellation fee. [forum, 2025-06-19](https://www.consumercomplaints.in/uber-india-cancellation-charges-unfair-and-unresponsive-uber-c3531087)

**Why now:** India's 2025 aggregator guidelines set cancellation penalties, giving riders a rule to cite.

pain 3 · frequency 4 · willingness 2 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

## Farming and food supply

### P012 · Fake seed in a real-looking bag

Counterfeit weedicide and faulty seed reach small farmers through local dealers, and the loss shows only weeks later as a dead crop. Genuine bags look overpriced next to fakes because farmers cannot check what a real product should cost, and the only route to compensation is a court case few can afford.

**Challenge:** Let a farmer check, at the dealer's counter, that a bag of seed or spray is genuine and fairly priced.

Legendary · for businesses · India · teaches Vision, Mobile apps, Data and dashboards · also Retail

<details><summary>Evidence (4) and scores (25)</summary>

- Agro-dealer says farmers do not know real prices of genuine seed, so cheaper counterfeit bags win and honest dealers look overpriced. [x, 2025-11-23](https://x.com/yofavagronomist/status/1992462963991572497)
- Small farmers hit by faulty seed have no practical way to claim compensation except costly court cases they cannot afford. [news, 2025-11-16](https://www.downtoearth.org.in/agriculture/seed-bill-2025-built-for-corporates-not-cultivators-farmers-warn)
- Madhya Pradesh soybean farmers lose crops after spraying counterfeit weedicide bought from local dealers. [news, 2025-08-18](https://www.newsonair.gov.in/strict-action-will-be-taken-against-companies-involved-in-manufacturing-fake-pesticides-fertilisers-seeds-says-union-minister-shivraj-singh-chouhan)
- Cotton farmers pay more each year for Bt seed that no longer resists pink bollworm, raising pesticide spend while yields fall. [news, 2025-04-04](https://www.downtoearth.org.in/agriculture/bt-cotton-seed-price-hike-experts-call-for-review-as-yields-decline-and-pest-attacks-rise)

**Why now:** The government's seed traceability system began rolling out in 2023 and 2024, and phone cameras can now read pack labels and codes offline.

pain 5 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P024 · Farmer collectives that can grow but cannot sell

Farmer producer organisations default on dues and fail at marketing, with no budget for branding, weak buyer trust and part-time boards who cannot price, contract or manage cold chain. Those that list online stall on cataloguing, labelling, food-safety rules, costly rural shipping and payments that take weeks.

**Challenge:** Let a farmer collective run its selling side without hiring a full-time trading team.

Mythic · for businesses · India · teaches AI agents, Automation and integrations, Full-stack web · also Retail

<details><summary>Evidence (3) and scores (25)</summary>

- FPO boards of part-time farmers cannot run a trading business; they cannot afford staff who can price, contract and manage cold chain. [other, 2026-08-13](https://www.csewhy.com/blog/what-is-farmer-producer-organisation)
- Many FPOs default on dues and fail at marketing: no budget for branding, weak buyer trust and chasing distant city markets they cannot serve. [news, 2025-07-07](https://www.downtoearth.org.in/agriculture/why-indias-farmer-producer-organisations-must-think-local-to-thrive)
- FPOs listing on ONDC struggle with cataloguing, labelling, FSSAI compliance, costly rural shipping and 15-20 day payment delays, with few buyers. [other, 2024-06-04](https://farm2exchange.blog/2024/06/04/challenges-and-solutions-for-fpos-engaging-in-online-business-on-ondc/)

**Why now:** India's push to 10,000 FPOs left thousands registered with little trading capacity, and language models can now draft catalogues, labels and contracts.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P036 · Milk poured today, paid for four months later

Dairy farmers who supply village societies and cooperatives often wait three or four months for milk money and promised incentives, while feed, school fees and loans fall due every week. The collectives themselves run short of working capital and cannot say when members will be paid, so farmers drift to private buyers or borrow at high rates.

**Challenge:** Make every dairy farmer know, each evening, what they are owed and when it will land.

Legendary · for creators · India · teaches Payments, Data and dashboards, Mobile apps · also Money

<details><summary>Evidence (7) and scores (24)</summary>

- Kenyan dairy farmers unpaid for three months of milk deliveries by cooperative creamery are switching to private buyers. [news, 2026-09-25](https://dairybusinessmea.com/2026/09/25/new-kcc-pushes-dairy-farmers-to-private-companies-amid-payment-crisis/)
- FPOs lack working capital to pay members upfront, stay stuck with local traders, and drown in company-law, GST and audit filings. [other, 2026-08-13](https://c4scourses.in/organization/farmer-producer-organisation-fpo-the-complete-a-to-z-guide/)
- Small women dairy farmers must rush milk to distant collection centres; heat lowers quality and rates, and husbands collect the payments. [news, 2026-08-06](https://www.downtoearth.org.in/renewable-energy/how-solar-cold-storage-is-helping-women-in-100-marathwada-villages-earn-from-milk)
- Tamil Nadu dairy farmers and village milk societies wait months for promised incentive dues, squeezing cash flow and society dividends. [news, 2026-01-09](https://dairynews.today/news/delayed-payments-and-price-cuts-impact-tamil-nadu-dairy-farmers.html)
- Rift Valley dairy farmers owed four months of raw milk payments cannot cover feed, school fees and household costs. [news, 2025-11-24](https://dairybusinessmea.com/2025/11/24/dairy-farmers-demand-us2-32m-pending-payments-for-raw-milk-deliveries/)
- Co-op dairy members see milk checks cut 20-25 percent to fund a plant overrun, with no alternative buyer for their milk. [news, 2025-05-02](https://capitalpress.com/2025/05/02/darigold-reduces-milk-checks-to-pay-for-construction-cost-overruns/)
- Nearly four lakh Aavin milk suppliers left unpaid on per-litre incentives for four months, with village societies running at a loss. [news, 2025-01](https://thehawk.in/news/india/aavin-milk-incentives-delayed-tn-farmers-demand-immediate-govt-intervention)

**Why now:** Arrears to milk suppliers made news in Tamil Nadu and Kenya through 2025 and 2026, and UPI is now universal in villages, so a clear member ledger is both demanded and payable.

pain 5 · frequency 4 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P048 · Crops ploughed under because the mandi offered ₹2

Small growers of onion, tomato, gourd, coconut and grains sell into the one market and the few traders within reach, often at ₹2 to ₹8 a kilo when it cost more to grow. Prices swing by half within days and nobody tells a grower where a better buyer sits a few hours away, so whole harvests are dumped or ploughed back into the soil.

**Challenge:** Tell a small grower, before harvest day, where and when their crop will fetch the most.

Epic · for creators · India · teaches Data and dashboards, Voice AI, AI agents · also Food

<details><summary>Evidence (7) and scores (24)</summary>

- With procurement stalled, wheat and millet growers sell to private traders below support price and lose bargaining power on timing. [news, 2026-05-14](https://www.downtoearth.org.in/agriculture/harvesting-of-wheat-almost-complete-yet-government-procurement-has-slowed)
- Maharashtra onion growers get Rs 300-800 per quintal against Rs 1,800 cost, forcing distress sales because they cannot find better buyers. [news, 2026-03-31](https://www.downtoearth.org.in/agriculture/war-in-west-asia-and-protectionist-steps-by-bangladesh-disrupt-onion-exports-lead-to-price-crash)
- Bihar vegetable grower destroys his own pointed-gourd crop after mandi offers only Rs 2 per kg, below cost of harvesting. [x, 2025-06-21](https://x.com/DeccanChronicle/status/1936402989654356021)
- Jharkhand tomato growers get Rs 2-3 per kg from wholesalers, below cultivation cost, and plough crops under instead of harvesting. [news, 2025-02-14](https://www.newkerala.com/news/o/jharkhand-farmers-forced-let-tomatoes-rot-prices-crash-914)
- Onion auction prices fell 65 percent in two weeks, leaving farmers below cost with thin competition among bidding traders. [news, 2024-12-26](https://www.downtoearth.org.in/agriculture/onion-farmers-face-heavy-losses-as-prices-crash-demand-removal-of-export-duty-ahead-of-goyals-visit)
- Sheopur farmers who switched from soy to paddy get Rs 1,500 per quintal below average in local mandis, with no visibility of better markets. [news, 2024-11-29](https://www.downtoearth.org.in/agriculture/disappointed-by-soy-market-prices-farmers-in-mps-sheopur-now-stare-at-paddy-glut)
- Cauvery delta coconut growers can only sell to local traders who set prices alone, with rates swinging from Rs 25 to Rs 6. [news, 2024-11-28](https://www.downtoearth.org.in/agriculture/coconut-cultivation-in-cauvery-delta-is-expanding-but-farmers-demand-better-market-linkages)

**Why now:** Daily mandi prices are open data and speech models now handle Hindi, Marathi and Tamil cheaply, so a spoken, personal selling brief costs almost nothing to send.

pain 5 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P060 · Growers keep under half of what the kitchen pays

Onion and potato growers receive less than half of the retail price, while independent restaurants nearby pay retail for the same produce because wholesalers want bigger orders than they can store. Growers who try to sell direct end up building their own customer network one phone call at a time.

**Challenge:** Connect small growers straight to the small kitchens near them, with orders sized for both.

Epic · for creators · India · teaches Full-stack web, Payments, Automation and integrations · also Food, Retail

<details><summary>Evidence (3) and scores (24)</summary>

- Onion and potato growers get barely 43 percent of retail price; mandi rates crash to Rs 5-7 per kg while consumers still pay high. [news, 2026-05-14](https://www.downtoearth.org.in/agriculture/onions-dumped-potato-crops-destroyed-why-falling-farm-prices-are-not-lowering-retail-food-bills)
- Independent restaurants pay retail prices for ingredients because wholesalers demand minimum orders larger than they can store or use. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#E0bqmIer4)
- Independent organic farmer says growers get unfair prices and had to build their own farm-to-plate network to secure fair, timely payment. [news, 2026-01-06](https://www.downtoearth.org.in/environment/anxiety-in-a-warming-world-why-i-became-a-full-time-organic-farmer)

**Why now:** UPI collections and cheap two-wheeler logistics now make small, frequent farm-to-kitchen orders workable where they were not a few years ago.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P072 · Pest advice that arrives after the crop is gone

Farmers struggle to get timely crop and cattle advice in their own language, so a vet visit costs money and days while informal advice often misleads. Pest attacks arrive without early warning, sprays are applied by guesswork, and residues end up in food while pests adapt.

**Challenge:** Give a farmer a trustworthy answer about a sick plant or animal, in their language, within the hour.

Rare · for businesses · India · teaches Voice AI, Vision, AI agents · also Health

<details><summary>Evidence (4) and scores (24)</summary>

- Farmers struggle to get timely crop and cattle advice in their own language; vet visits cost money and delays, and informal advice misleads. [news, 2026-09-25](https://thebetterindia.com/farming/ai-for-farmers-india-sarlaben-mahavistaar-local-language-cattle-crops-12574226)
- Farms depend on chemical pesticides that leave residues in food and water while pests and weeds keep adapting to them. [yc, 2026-04-28](https://www.ycombinator.com/rfs#summer-2026-ai-for-low-pesticide-agriculture)
- Small livestock farmers with unstable incomes accept buyer contracts with no room to negotiate, plus poor access to vets and fair pricing. [news, 2026-04-21](https://www.downtoearth.org.in/agriculture/how-supply-chain-cruelty-drives-hidden-costs-for-farmers-workers-and-consumers)
- After years of pest attacks without reliable early warning, cotton farmers abandon the crop; real-time pest monitoring reaches only a handful. [news, 2024-08-13](https://www.downtoearth.org.in/agriculture/low-kharif-cotton-years-of-pest-attacks-push-farmers-to-grow-other-crops)

**Why now:** Multilingual speech and image models became good and cheap in 2025, so a spoken question with a photo can get a specific answer at near-zero cost.

pain 4 · frequency 4 · willingness 2 · buildability 4 · learning 5 · novelty 2 · openness 3

</details>

### P084 · Fruit that rots between the field and the buyer

Up to 15 percent of fruit and 12 percent of vegetables are lost between harvest and sale, because growers lack storage and grading at the farm gate and sell into gluts. Perishable shipments that do move are delayed or damaged in transit with no record of what happened, so claims go nowhere.

**Challenge:** Make it cheaper for a grower to hold, grade or ship a perishable crop than to dump it.

Legendary · for businesses · India · teaches Vision, Data and dashboards, Automation and integrations · also Manufacturing

<details><summary>Evidence (4) and scores (24)</summary>

- Perishable mango shipment delayed and damaged in transit, with no damage documentation offered and no response on the claim. [forum, 2026-05-26](https://www.consumercomplaints.in/delhivery-product-was-delayed-no-response-and-damaged-package-c3542064)
- Tomato growers get a fraction of retail price as synchronized harvests flood markets and no processing outlet absorbs the glut. [news, 2025-03-13](https://www.philstar.com/nation/2025/03/13/2427975/tomato-farmgate-price-drops-p6-kilo)
- Tomato, onion and potato growers lack farm-gate storage and grading to hold produce, so they sell into crashes below cost. [news, 2025-01-03](https://www.downtoearth.org.in/agriculture/why-has-governments-operation-greens-scheme-aka-tomato-onion-potato-top-failed)
- Up to 15 percent of fruit and 12 percent of vegetables are lost between harvest and sale, eroding growers' and traders' income. [news, 2024-08-07](https://www.downtoearth.org.in/governance/as-told-to-parliament-august-6-2024-4-8-grains-5-15-fruits-vegetables-lost-after-harvest)

**Why now:** Phone cameras can now grade produce reliably and timestamped photos are accepted as evidence, while gluts in 2025 made losses headline news.

pain 5 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P096 · Farm books that take a season to set up

Farm accounting and record software demands heavy setup before it is useful, record entry is tedious, and input stock does not update when a purchase is logged. Small farms and women-led producer companies end up without reliable books, and collectives fold once grants end because nobody can manage the money.

**Challenge:** Turn a farm's receipts and purchases into usable books with no setup at all.

Rare · for businesses · global · teaches Vision, Automation and integrations, Data and dashboards · also Money

<details><summary>Evidence (5) and scores (23)</summary>

- Women-led farmer producer companies fold after grants end, lacking management skills, financial literacy and safe access to male-dominated markets. [news, 2026-09-29](https://www.downtoearth.org.in/agriculture/women-farmer-producer-companies-can-redefine-gender-roles-and-champion-agri-entrepreneurs)
- Farm admin staff find record-entry workflows in farm software tedious and some features hard to learn. [capterra, 2025-09-16](https://www.capterra.com/p/136765/Farmbrite/reviews/#3)
- Farm office manager says farm accounting software needs heavy upfront time to configure entities and chart of accounts. [capterra, 2024-12-03](https://www.capterra.com/p/218915/Traction/reviews/#1)
- Farm app has no stock management, so input inventory does not update when purchases are logged. [capterra, 2024-08-06](https://www.capterra.com/p/163565/fieldmargin/reviews/#2)
- Farm manager finds input inventory tracking tedious and bank reconciliation slow in farm management software. [capterra, 2024-05-29](https://www.capterra.com/p/216112/Aegro/reviews/#1)

**Why now:** Receipt photos and voice notes can now be turned into ledger entries automatically, removing the setup step that puts farmers off.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P108 · Carbon money promised to farmers, mostly never paid

Farmers enrolled in private carbon programmes do not know what they will earn or when, see payouts cut without explanation and never receive the soil results collected from their own fields. Nearly all in one study got no payment and over a quarter quit, while the software these programmes run on keeps farm data muddled and badly separated.

**Challenge:** Show every enrolled farmer what their fields have earned, why, and when the money comes.

Legendary · for businesses · India · teaches Data and dashboards, Voice AI, Full-stack web · also Money

<details><summary>Evidence (4) and scores (23)</summary>

- Agri sustainability analyst says the farm ERP mobile app badly needs updates and data is not separated by login. [capterra, 2026-09-04](https://www.capterra.com/p/130210/FarmERP/reviews/#2)
- Farmers in private carbon programmes see payouts cut without explanation and never receive the soil test results collected from their fields. [news, 2026-08-06](https://www.isignal.in/investigations/why-farmers-need-to-see-the-money-to-stay-in-carbon-farming-988408)
- Farmers enrolled in carbon projects do not know what they will earn or when, and ignore the company app meant to inform them. [news, 2026-08-01](https://www.isignal.in/investigations/the-communication-gap-thats-plaguing-private-carbon-farming-988266)
- Nearly all farmers in voluntary carbon projects got no payment, many saw yields fall, and unclear guidance made over a quarter quit. [news, 2024-12-20](https://www.downtoearth.org.in/climate-change/99-farmers-in-haryana-and-mp-participating-in-voluntary-carbon-market-received-no-benefits-finds-study)

**Why now:** Voluntary carbon schemes enrolled many Indian farmers by 2025, and complaints of unpaid credits made news from 2024 to 2026.

pain 3 · frequency 2 · willingness 3 · buildability 3 · learning 3 · novelty 5 · openness 4

</details>

### P120 · Produce nobody can trace back to a farm

When a family died after eating contaminated watermelon, there was no way to trace the fruit, and vegetables reaching Delhi carry no record of whether they were grown with drain water. Packaged foods like cakes arrive stale with no record of when they were made, so buyers cannot judge safety and sellers cannot prove it.

**Challenge:** Give a fruit seller or small maker a way to show where and when their food was grown or made.

Legendary · for consumers · India · teaches Mobile apps, Vision, Data and dashboards · also Food, Health

<details><summary>Evidence (3) and scores (23)</summary>

- Online cake buyer received stale, foul-smelling cakes and reported food poisoning, with no traceability of when the cakes were made. [other, 2026-07-05](https://se.trustpilot.com/review/bakingo.com#2)
- Vegetables reaching Delhi through Azadpur carry no traceability, so shoppers cannot tell if produce was grown with contaminated drain water. [news, 2026-05-21](https://www.downtoearth.org.in/agriculture/for-farmers-in-rural-delhi-struggling-with-rising-input-costs-and-declining-water-wastewater-dependence-is-a-no-brainer-despite-health-risks-involved)
- Food buyers have no way to trace or verify fruit safety after a family died from a contaminated watermelon bought in Mumbai. [news, 2026-05-13](https://www.downtoearth.org.in/food/watermelons-summers-symbol-causes-scare)

**Why now:** Food scares in 2025 and 2026 made traceability a public demand, and printed QR labels cost paise.

pain 5 · frequency 3 · willingness 2 · buildability 3 · learning 3 · novelty 3 · openness 4

</details>

### P132 · Queueing for urea, paying extra for the privilege

Farmers queue for fertiliser with no idea which dealer has stock, then pay above the subsidised price and accept tie-in products they did not want. Feed for cattle and poultry has nearly doubled in cost per unit, and when inputs are bought online, refunds for failed orders can go unanswered.

**Challenge:** Show farmers where inputs are in stock today and at what fair price, before they leave home.

Legendary · for businesses · India · teaches Mobile apps, Data and dashboards, Voice AI · also Retail

<details><summary>Evidence (4) and scores (22)</summary>

- Small layer poultry farmers see feed cost per egg nearly double but cannot raise egg prices, absorbing about 20 percent losses. [news, 2026-09-26](https://www.isignal.in/agriculture/why-diverting-maize-for-ethanol-is-affecting-poultry-farmers-989946)
- Farmer buying inputs on AgroStar says return and refund were never processed and support stopped responding. [x, 2026-05-20](https://x.com/the__shyam/status/2057108916656627757)
- Nearly three-quarters of small cattle rearers struggle to get affordable feed and fodder, capping how much milk they can sell. [news, 2026-01-21](https://www.downtoearth.org.in/agriculture/30-million-indian-cattle-rearing-households-do-not-sell-milk-ceew-study)
- Telangana farmers queue for urea with no reliable stock information, pay above subsidised price and are forced into tie-in purchases by dealers. [news, 2025-08-18](https://www.downtoearth.org.in/agriculture/urea-shortage-in-telangana-sparks-political-row-as-farmers-queue-for-fertiliser)

**Why now:** Fertiliser shortages and feed price spikes in 2025 and 2026 made stock information a daily need, and voice notes let a farmer report stock in seconds.

pain 4 · frequency 3 · willingness 2 · buildability 3 · learning 3 · novelty 3 · openness 4

</details>

## Homes and real estate

### P007 · Interiors promised in 45 days, unfinished at four months

Homeowners pay large advances or the full amount upfront for interiors, then work starts late or not at all, staff change without handover and projects run months past the promised date. Defects stay open and refunds are refused once money has moved. A family's biggest spend after the home itself becomes a hostage.

**Challenge:** Tie every rupee of an interiors project to a finished, photographed stage of the work.

Legendary · for consumers · India · teaches Payments, Mobile apps · also Money

<details><summary>Evidence (5) and scores (27)</summary>

- HomeLane interior project started four months ago is still unfinished with no clear completion date. [other, 2026-10-05](https://www.trustpilot.com/review/www.homelane.com#1)
- Interior firm collected full payment upfront, then work dragged for months with poor coordination. [other, 2026-09-30](https://www.trustpilot.com/review/www.homelane.com#2)
- Homeowner paid a large interiors advance, no work started, and the platform refused a refund. [forum, 2026-09-27](https://www.consumercomplaints.in/nobroker-nobroker-interior-c3545095)
- Livspace interior project promised in 45 days ran four months late with shabby workmanship and poor escalation handling. [other, 2026-09-25](https://www.trustpilot.com/review/livspace.com#1)
- Interior job delayed three months with defects; staff changed without handover and post-sales complaints stayed open. [other, 2026-09-19](https://www.trustpilot.com/review/livspace.com#3)

**Why now:** New-home handovers peaked in 2025 and 2026, and complaints about delayed interiors followed.

pain 5 · frequency 3 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P019 · List one flat, get fifteen sales calls a day

Free property listings are throttled to near-zero views while sales teams call relentlessly to push paid upgrades. Property sites share numbers with developers without consent, and former users still get over fifteen sales calls a day years after closing the account. Owners learn that listing a home costs them their phone number for good.

**Challenge:** Let an owner list a property without ever exposing their real phone number to a sales team.

Epic · for consumers · India · teaches Voice AI, AI agents, Mobile apps

<details><summary>Evidence (5) and scores (26)</summary>

- Free listings on 99acres get buried with zero leads while sales teams aggressively push paid upgrades. [other, 2026-10-05](https://www.trustpilot.com/review/99acres.com#1)
- Owner says free MagicBricks listings are throttled to near-zero views to force paid upgrades. [other, 2026-10-02](https://www.trustpilot.com/review/magicbricks.com#1)
- Owners listing a property face relentless spam calls pushing them to upgrade to paid listings. [other, 2026-08-21](https://www.trustpilot.com/review/99acres.com?page=2#1)
- Former property portal user still gets over fifteen sales calls daily and spam years after closing the account. [forum, 2026-07-22](https://www.consumercomplaints.in/nobroker-nonstop-spam-emails-even-after-account-termination-c3543493)
- Property portal shared a user's number with developers without consent, causing persistent spam calls. [forum, 2024-03-27](https://www.consumercomplaints.in/magicbricks-non-consensual-sharing-of-contact-details-and-repeated-spam-c3504595)

**Why now:** India's data protection rules took effect from 2025, and voice agents can now answer calls on an owner's behalf.

pain 3 · frequency 5 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P031 · Nobody records a home's condition before money moves

Renters learn about mould, pests and other hazards only after signing the lease, and new owners discover seepage, cracks or termites within weeks because proper pre-purchase inspections are rare. At move-out, even tenants with photos lose deposit disputes. Without an agreed record of condition at handover, every later argument is one word against another.

**Challenge:** Produce a timestamped condition report of a home in fifteen minutes that both sides sign.

Epic · for consumers · India · teaches Vision, Mobile apps

<details><summary>Evidence (3) and scores (26)</summary>

- Tenant disputes heavy security deposit deductions at move-out despite having photo evidence of flat condition. [forum, 2026-09-18](https://www.consumercomplaints.in/nobroker-final-settlement-after-moving-out-c3544852)
- New homeowners discover seepage, cracks or termites within weeks because proper pre-purchase inspections are rare. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#VesjE7BQb)
- Renters cannot learn about mould, pests or other hazards in a home until after signing the lease. [fixmyitch, 2026-01](https://razorpay.com/m/fix-my-itch/#highlight-can-t-renters-access-verified-mold-)

**Why now:** Phone cameras and vision models can now flag damp and cracks well enough to anchor a shared record.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 4

</details>

### P043 · Hundreds of hits and not one real tenant

Landlords on paid listing plans see hundreds of hits but no genuine tenant or buyer inquiries, and long-time landlords say lead quality from listing sites has deteriorated badly. Sorting brokers, bots and the merely curious from real tenants eats evenings. The landlord pays twice, once for the plan and once in wasted calls.

**Challenge:** Sort a landlord's rental enquiries into real tenants and noise before anyone picks up the phone.

Epic · for businesses · India · teaches Voice AI, AI agents

<details><summary>Evidence (3) and scores (25)</summary>

- Landlord's paid plan produced hundreds of hits but no genuine tenant inquiries. [other, 2026-09-24](https://www.trustpilot.com/review/magicbricks.com#2)
- Owner bought a MagicBricks premium listing plan but got no genuine tenant or buyer inquiries. [forum, 2026-06-14](https://www.consumercomplaints.in/magicbricks-complaint-against-magicbricks-for-misleading-customers-and-charging-money-without-providing-effective-service-c3542636)
- Long-time landlord says rental leads from TenantCloud listings have deteriorated badly in quality. [capterra, 2026-01-23](https://www.capterra.com/p/133029/TenantCloud/reviews/#2)

**Why now:** Voice agents became cheap enough in 2025 to call and pre-qualify every enquiry for a few rupees.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P055 · Property management fees for inspections nobody does

Landlords pay percentage fees for property management and tenant-finding packages, then get no inspections, no showings, missing tenant documents and no lease enforcement. Scheduled inspectors do not turn up, managers are unavailable and refunds are refused. Owners, often far away, find out only when something has already gone wrong.

**Challenge:** Give a distant landlord proof, every month, that someone actually visited and checked their flat.

Epic · for businesses · India · teaches Mobile apps, Vision

<details><summary>Evidence (5) and scores (25)</summary>

- Landlord paying a percentage fee for NoBroker property management got no inspections, missing tenant documents and no lease enforcement. [other, 2026-10-06](https://www.trustpilot.com/review/nobroker.in#1)
- Landlord paid for property management and tenant-finding package but got zero showings and was refused a refund. [forum, 2026-08-20](https://www.consumercomplaints.in/nobroker-cheating-denying-refund-of-my-money-c3544195)
- Landlord paid for tenant-finding with photoshoot and ads, but none were delivered and the manager went silent. [forum, 2026-03-20](https://www.consumercomplaints.in/nobroker-nondelivery-of-paid-tenantfinding-service-and-unresponsive-relationship-manager-c3540147)
- Owner paid for a property management plan, then was told no manager was available and asked to downgrade. [forum, 2025-12-02](https://www.consumercomplaints.in/nobroker-i-am-complaining-about-property-management-services-c3537518)
- Owner paid for a scheduled property inspection but the inspector never turned up. [forum, 2025-10-09](https://www.consumercomplaints.in/nobroker-property-mnagement-services-c3535567)

**Why now:** Owners abroad and in other cities grew as a share of Indian landlords, and a phone photo with location is now proof enough.

pain 4 · frequency 3 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P067 · Wiring a deposit to someone who cloned the listing

Scammers clone real rental listings, impersonate the owner and collect deposits for homes that are not for rent, and police have logged hundreds of such reports. Renters who toured a real flat still wire money to the wrong person, and students lose PG booking deposits to owners who vanish. A deposit is often a month or more of savings.

**Challenge:** Let a renter confirm, before sending any money, that the person asking for it really controls the home.

Legendary · for consumers · global · teaches Vision, AI agents · also Money

<details><summary>Evidence (3) and scores (25)</summary>

- Renter toured a real apartment but wired a large deposit to a scammer who cloned the listing and impersonated the owner. [x, 2026-08-06](https://x.com/abc7newsbayarea/status/2085508740577472532)
- Police log nearly 200 rental scam reports where fake listings collect deposits for homes that are not for rent. [x, 2026-06-17](https://x.com/NC5/status/2067104716060839947)
- Student lost a PG booking deposit to a fake listing whose owner disappeared after payment. [forum, 2025-05-20](https://www.consumercomplaints.in/magicbricks-paying-guest-property-c3529107)

**Why now:** Rental scam reports rose through 2025 and 2026 as cloned listings got easier to fake with AI images and text.

pain 5 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P079 · The painting quote that doubles by the last coat

Painting and interior jobs start with a low quote that balloons with extras, sometimes to many times the original estimate after an advance is paid. Homeowners cannot read confusing quotations, pay premium prices for poor-quality modules and wrong materials, and have no benchmark to push back with. Final bills land far above what anyone agreed.

**Challenge:** Turn any interiors or painting quote into a fair price check a homeowner can take back to the contractor.

Epic · for consumers · India · teaches AI agents, Vision, Data and dashboards

<details><summary>Evidence (5) and scores (25)</summary>

- Interior firm took a lakh-rupee advance then quoted many times the original estimate and refused a refund. [other, 2026-09-25](https://www.trustpilot.com/review/livspace.com#2)
- Painting and maintenance job billed near two lakh rupees with substandard work and wrong materials installed. [forum, 2026-09-24](https://www.consumercomplaints.in/nobroker-false-promises-and-pathetic-service-pure-daylight-robbery-c3545008)
- Homeowner paid premium prices for modular interiors that turned out to be poor quality modules. [other, 2026-09-18](https://www.trustpilot.com/review/www.homelane.com#3)
- Painting jobs start with a low quote that balloons with extras, leaving final bills far above the estimate. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#QaempsPO7)
- Homeowner found interior quotations confusing and overpriced, with poor communication throughout the project. [other, 2026-01-03](https://www.trustpilot.com/review/livspace.com#4)

**Why now:** Vision models can read a messy handwritten or PDF quote in 2025, and material prices are publicly listed.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P091 · A technician says the compressor is gone again

Appliance technicians charge an inspection fee, misdiagnose faults and push unnecessary part replacements at inflated prices. Air conditioner installation charges vary several-fold for the same job, with surprise extras for piping and brackets. Households cannot tell what was really needed, so they overpay or stop trusting every technician.

**Challenge:** Give a household a trustworthy second opinion on a repair quote before they say yes.

Epic · for consumers · India · teaches Voice AI, AI agents

<details><summary>Evidence (4) and scores (25)</summary>

- AC repair technician booked via Urban Company allegedly misdiagnosed the fault and gave wrong warranty information, inflating the repair. [forum, 2026-09-09](https://www.consumercomplaints.in/urban-company-wrong-assessment-of-ac-and-misleading-customer-c3544659)
- Appliance repair technician pushed unnecessary part replacements at inflated prices, leaving customers unsure what was really needed. [other, 2026-09-07](https://www.trustpilot.com/review/urbancompany.com#4)
- Homeowners feel cheated when appliance technicians charge an inspection fee and then quote inflated prices for parts. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#eQWO6wbQd)
- Air conditioner installation charges vary several-fold for the same job, with surprise extras for piping and brackets. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#MtkxNqirf)

**Why now:** Voice models in Indian languages can now walk a household through symptoms and compare a quote against part prices.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P103 · Owner-only listings that are brokers in disguise

Renters pay for owner-only searches and keep getting broker numbers, while many attractive listings are broker bait with borrowed photos or homes that are not available. Relationship managers change constantly and promises made at sale evaporate. Tenants end up paying brokerage anyway, after paying to avoid it.

**Challenge:** Flag a broker posing as an owner, or a borrowed photo, before a renter makes the call.

Rare · for consumers · India · teaches Vision, AI agents

<details><summary>Evidence (3) and scores (24)</summary>

- Paid house hunter keeps getting broker numbers instead of owners, while relationship managers change constantly. [other, 2026-09-14](https://www.trustpilot.com/review/housing.com#3)
- Rental subscription upsold with false promises; support unreachable afterwards and brokers still appear in contacts. [forum, 2026-08-27](https://www.consumercomplaints.in/nobroker-false-promise-and-sweet-talking-into-taking-a-subscription-c3544359)
- Renters find many attractive listings are fake broker bait with borrowed photos or homes that are not available. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#P3jjRQCzl)

**Why now:** Image matching is cheap now, and broker-bait listings on Indian portals grew as paid owner plans spread.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P115 · The token amount that never comes back

Renters pay a token advance to hold a flat, then the owner backs out or rents it to someone else and the refund stays pending for months. Escalation contacts do not work and managers stop responding. Small sums vanish because chasing them costs more than they are worth.

**Challenge:** Make a rental token refundable by default, released only when both sides confirm the deal.

Epic · for consumers · India · teaches Payments, Full-stack web · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- Renter cannot get a token advance refunded and the escalation contacts provided do not work. [other, 2026-09-28](https://www.trustpilot.com/review/nobroker.in#4)
- Tenant's token amount was not refunded after the flat was rented to someone else despite an earlier booking. [forum, 2026-03-25](https://www.consumercomplaints.in/nobroker-complaint-regarding-token-amount-refund-kalpataru-hills-property-thane-c3540271)
- Owner backed out after a rental token was paid; refund pending for months with an unresponsive manager. [forum, 2025-11-13](https://www.consumercomplaints.in/nobroker-refund-of-token-amount-c3536914)

**Why now:** Indian payment providers widened escrow and hold-and-release options in 2025, which suits small rental tokens.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P127 · Six months' deposit, and deductions nobody explains

Brokers in Bengaluru quote fictitious legal limits and still demand six months of rent as deposit. At move-out, inspection teams inflate repair costs and co-living operators cut flat amounts for unexplained service charges. Tenants lose large sums they cannot contest.

**Challenge:** Give a tenant a deposit statement they can contest line by line, with the law and the photos beside it.

Epic · for consumers · India · teaches AI agents, Data and dashboards · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- Tenant says move-out inspection team inflates repair costs and makes unauthorised deductions from the rental deposit. [other, 2026-09-27](https://www.trustpilot.com/review/nobroker.in#3)
- Co-living resident had a flat amount cut from the deposit for an unexplained service charge at exit. [other, 2026-09-07](https://www.trustpilot.com/review/zolostays.com#1)
- Bengaluru brokers quote fictitious legal deposit limits and still demand six months of rent upfront from tenants. [news, 2026-08-02](https://newskarnataka.com/bengaluru/bengalurus-rental-deposit-debate-goes-viral-after-x-users-post/02082026/)

**Why now:** Model tenancy rules and 2026 news on illegal deposit demands raised awareness, but tenants still lack a way to contest.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P139 · Proving what was damaged and what it was worth

When a technician damages an air conditioner compressor or a repair visit floods the home, households find no compensation process and service providers deny cover. Homeowners facing insurance claims must photograph and value every possession, a tedious job taking many hours. Without proof of what existed and what it cost, claims are cut or refused.

**Challenge:** Help a household build a valued, photographed inventory of its home in under an hour.

Epic · for consumers · India · teaches Vision, AI agents

<details><summary>Evidence (3) and scores (24)</summary>

- Technician's repair visit caused a water leak that damaged the home, with no compensation process. [forum, 2026-07-17](https://www.consumercomplaints.in/urban-company-water-purifier-c3543370)
- Homeowners in wildfire zones must photograph and value every possession for insurance, a tedious task taking many hours. [hn, 2025-12-15](https://news.ycombinator.com/item?id=46274930)
- Technician damaged an AC compressor during servicing and the platform denied cover for professional-caused damage. [forum, 2025-05-01](https://www.consumercomplaints.in/urban-company-urban-company-technician-broke-my-ac-compressor-no-accountability-or-resolution-c3528376)

**Why now:** Vision models can identify and price household items from a walkthrough video, which was not practical before 2025.

pain 4 · frequency 2 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P150 · Nobody will come to fix one switchboard

Homeowners cannot get electricians to come for small jobs like a fan or switchboard because they prefer big contracts, and a night-time plumbing emergency means paying inflated rates for whoever answers. People who would fix things themselves lack experienced local help, and a tiny repair turns into a store trip plus research into paints, fillers and tools. Small faults linger for weeks.

**Challenge:** Get a household's small repair diagnosed by video and either fixed by them or by someone nearby today.

Rare · for consumers · India · teaches Voice AI, Vision

<details><summary>Evidence (4) and scores (24)</summary>

- People who want to repair their own appliances lack local places offering experienced help. [hn, 2026-08-18](https://news.ycombinator.com/item?id=49342643)
- A tiny home repair turns into a hardware-store trip plus research into paints, fillers and tools. [hn, 2026-05-26](https://news.ycombinator.com/item?id=48286130)
- Homeowners cannot get electricians to come for small jobs like a fan or switchboard because they prefer big contracts. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#fQoPTT6iK)
- Homeowners with a night-time plumbing emergency cannot quickly find a verified plumber and pay inflated emergency rates. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#JKFMxUGDZ)

**Why now:** Live video with vision models can now diagnose a simple fault and guide a fix, making small jobs economic.

pain 3 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P160 · Paying in full before anyone checks the work

Deep cleaning services vary wildly, missing areas with no checklist or way to verify the work, and harsh chemicals have ruined fittings and furniture with no remedy. Customers commissioning carpentry must pay in full before checking quality, and defects appear after installation. The household carries all the risk of work it cannot inspect.

**Challenge:** Let a household sign off a cleaning or carpentry job from before-and-after photos before the final payment.

Epic · for consumers · India · teaches Vision, Mobile apps

<details><summary>Evidence (4) and scores (24)</summary>

- Home deep-cleaning booked via NoBroker damaged a sofa with water and poor technique; no accountability for service quality. [forum, 2026-10-02](https://www.consumercomplaints.in/nobroker-do-not-avail-nobroker-cleaning-service-c3545220)
- Bathroom deep clean used harsh acid that ruined chrome fittings and made taps leak, with no remedy offered. [other, 2026-09-22](https://www.trustpilot.com/review/urbancompany.com#2)
- Deep cleaning services vary wildly in quality, with missed areas and no checklist or way to verify the work. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ye0dxiCU4)
- Customers commissioning carpentry cannot check quality before paying in full, and defects show up after installation. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#AeoHQAQDs)

**Why now:** Vision models can now compare before and after photos of a room, giving households a fair basis for sign-off.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P170 · Rental search help that delivers one viewing

Renters buy paid search plans promising dozens of matching properties and a set number of owner contacts, then get one viewing in twenty days or none at all. Relationship managers admit they have no verified properties, and refunds are refused on the grounds that the service was used. The renter pays for help and still does the search alone.

**Challenge:** Line up five real viewings that match a renter's brief within one week.

Epic · for consumers · India · teaches AI agents, Automation and integrations

<details><summary>Evidence (6) and scores (23)</summary>

- Premium rental search service delivered only one property viewing in twenty days. [other, 2026-09-23](https://www.trustpilot.com/review/99acres.com#3)
- Housing.com premium plan buyer got only occasional contact and few property suggestions over the whole 45-day plan. [other, 2026-09-23](https://www.trustpilot.com/review/housing.com#1)
- Paid account activation took nearly a week, then refund was refused claiming the service had been used. [other, 2026-09-19](https://www.trustpilot.com/review/magicbricks.com#4)
- After paying for rental search help, the relationship manager admitted having no verified properties to offer. [other, 2026-08-21](https://www.trustpilot.com/review/housing.com#4)
- Renter's paid plan promised a set number of owner contacts but delivered none after payment. [forum, 2026-03-04](https://www.consumercomplaints.in/nobroker-refund-request-for-freedom-plan-unable-to-get-owner-contact-details-c3539798)
- Tenant plan sold with a promise of dozens of matching properties; company stopped responding after purchase. [forum, 2026-01-25](https://www.consumercomplaints.in/nobroker-unprofessional-behaviour-and-false-promises-c3539003)

**Why now:** Agents that can search listings and message owners became practical in 2025, the exact work paid relationship managers fail to do.

pain 3 · frequency 3 · willingness 4 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P180 · The five-minute walk to the metro takes twenty

Property sites are full of ghost listings for homes already sold or rented, and developers find unverified listings of their projects they cannot control. Ads promise a short walk to the metro when the real peak-hour commute is far longer, and buyers making huge purchases lack reliable data on schools, safety, air, water and power cuts. People choose a home on claims nobody checks.

**Challenge:** Tell a home seeker the real commute, power cuts and air quality for any address in under a minute.

Rare · for consumers · India · teaches Data and dashboards, AI agents

<details><summary>Evidence (4) and scores (23)</summary>

- Property portal is full of ghost listings for homes already sold or rented, wasting buyers' and renters' time. [other, 2026-09-24](https://www.trustpilot.com/review/99acres.com#2)
- Developer finds unauthorised, unverified listings of its project on Housing.com with no way to control them. [other, 2026-09-20](https://www.trustpilot.com/review/housing.com#2)
- Property ads promise a short walk to the metro, but real peak-hour commute times are far longer. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#vQXugT6LR)
- Homebuyers making huge purchases lack reliable data on a neighbourhood's schools, safety, air, water and power cuts. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#Mop5ESQAL)

**Why now:** Commute, air-quality and outage data became openly available for Indian cities, while listing claims stayed unchecked.

pain 3 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P189 · Co-living rooms that change after you have paid

Co-living and managed-rental residents face undisclosed upfront fees, unreliable internet, unauthorised rent increases and eviction threats. Bookings are confirmed without real availability, residents are moved to inferior rooms, and move-out fees cover damage caused by the operator's own staff. Young tenants new to a city have little leverage and less recourse.

**Challenge:** Let a young tenant compare co-living operators on what residents actually paid and got.

Epic · for consumers · India · teaches Data and dashboards, Full-stack web

<details><summary>Evidence (4) and scores (23)</summary>

- Co-living operator charges undisclosed fees upfront and provides unreliable internet to residents. [other, 2026-08-01](https://www.trustpilot.com/review/zolostays.com#2)
- Co-living bookings confirmed without real availability, then tenants are moved to inferior rooms. [other, 2026-06-29](https://www.trustpilot.com/review/zolostays.com#3)
- PG resident reports unauthorised rent increases and eviction threats from co-living management. [other, 2026-04-15](https://www.trustpilot.com/review/zolostays.com#4)
- Managed-rental tenant charged large move-out fees, including for damage caused by the manager's own staff. [forum, 2026-04-04](https://www.consumercomplaints.in/nobroker-unjustified-deductions-property-damage-by-staff-and-unfair-move-out-charges-by-nobroker-pms-c3540566)

**Why now:** Co-living grew fast in Indian cities after 2024, and complaints about hidden fees grew with it.

pain 4 · frequency 3 · willingness 2 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P197 · Housing societies find tank cleaners by word of mouth

Apartment societies struggle to find and schedule water tank cleaning, wait months for municipal pruning of dangerous branches before the monsoon, and find no quick private service to assess risky trees. Where management firms are hired, boards say they hide behind a portal and lose contact with residents. Upkeep slips until something breaks or falls.

**Challenge:** Let a housing society book, track and verify every seasonal upkeep job from one shared calendar.

Rare · for businesses · India · teaches Automation and integrations, Mobile apps

<details><summary>Evidence (4) and scores (23)</summary>

- Apartment residents struggle to find and schedule professional water tank cleaning, relying on word of mouth. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#oqmTiDQM8)
- Housing societies wait months for municipal pruning of dangerous overhanging branches before the monsoon. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#X0qjzf9ow)
- Residents facing dangerous trees before storms find no quick, private service to assess and trim them. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#xHAyn09hk)
- HOA board member says the management firm hides behind the AppFolio portal, losing personal contact with residents. [capterra, 2025-10-01](https://www.capterra.com/p/92228/AppFolio-Property-Manager/reviews/#2)

**Why now:** Monsoon damage in Indian cities made pre-season upkeep urgent, and societies now coordinate almost entirely on phones.

pain 3 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P205 · Warranty refused, so the same fault gets paid twice

Local repair shops give no warranty on work or parts, and even where one is promised, an air conditioner can stay faulty after nearly ten thousand rupees of repairs while the warranty is refused. Pest control customers watch cockroaches or termites return within months and see warranty revisits delayed or denied. Households pay again for the same fault.

**Challenge:** Make a home repair or pest control warranty something a household can actually claim in one message.

Epic · for consumers · India · teaches Mobile apps, Automation and integrations

<details><summary>Evidence (4) and scores (23)</summary>

- AC still faulty after nearly ten thousand rupees of repairs, and the stated warranty was refused. [other, 2026-08-31](https://www.trustpilot.com/review/urbancompany.com?page=2#1)
- Local appliance repair shops give no warranty on work or parts, so a repeat fault means paying again. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#Yt2FqFwe_)
- Households pay for pest control only to see cockroaches or termites return within months, with warranty claims refused. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#J1mLdo0gT)
- Cockroaches returned within weeks of pest control and the warranty revisit kept getting delayed. [forum, 2025-03-04](https://www.consumercomplaints.in/urban-company-pest-control-c3525732)

**Why now:** Home services moved to online bookings by 2025, so every job now leaves a digital trail a warranty could hang on.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P213 · When the cook quits on Monday morning

Families relying on a full-time domestic worker face chaos when she quits suddenly, with no stopgap help available. Parents who work late cannot find a verified, trustworthy babysitter for a few evening hours without hiring a full-time nanny, and prepaid household help can stay unavailable for months. Working parents lose workdays to gaps nobody can fill at short notice.

**Challenge:** Find a family verified help for tonight or this week, without a month-long contract.

Epic · for consumers · India · teaches Mobile apps, Payments · also Work

<details><summary>Evidence (3) and scores (23)</summary>

- Household help prepaid through an app was unavailable for months across several bookings, leaving money stuck. [forum, 2026-07-27](https://www.consumercomplaints.in/urban-company-instahelp-c3543603)
- Families relying on a full-time domestic worker face chaos when she quits suddenly, with no stopgap help available. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#YSkvVOzMa)
- Parents who work late cannot find verified, trustworthy babysitters for a few evening hours without hiring a full-time nanny. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#MFcgNXQp6)

**Why now:** Dual-income households in Indian cities grew after 2024, and short-notice help became a weekly worry.

pain 4 · frequency 3 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P220 · Owners abroad who cannot see their own property

Indians living abroad worry about encroachment on vacant property and get no real-time updates from caretakers. Small landlords and their managers find preset reports too limited, owner tax documents locked behind higher plans, multiple currencies unsupported and accounting that needs an accountant to decode. Owners cannot see what their property earns or what is happening to it.

**Challenge:** Give a property owner abroad a monthly statement and photo update they trust, in their own currency.

Rare · for businesses · global · teaches Data and dashboards, Automation and integrations · also Money

<details><summary>Evidence (6) and scores (23)</summary>

- Property management controller finds Rent Manager financial reports harder to build than in general accounting tools. [capterra, 2026-08-19](https://www.capterra.com/p/2732/Rent-Manager/reviews/#1)
- Property manager pays a high price for Buildium yet uses few features and cannot handle multiple currencies. [capterra, 2026-06-02](https://www.capterra.com/p/47428/Buildium-Property-Management-Software/reviews/#2)
- Brokerage managing rentals finds Buildium's preset reports too limited to research portfolio data without manual exports. [capterra, 2026-06-02](https://www.capterra.com/p/47428/Buildium-Property-Management-Software/reviews/#1)
- Controller cannot post journal entries for both accrual and cash basis in Buildium, complicating owner accounting. [capterra, 2026-03-25](https://www.capterra.com/p/47428/Buildium-Property-Management-Software/reviews/#4)
- Small property manager must upgrade TenantCloud plan just to get tax documents for owners. [capterra, 2026-01-18](https://www.capterra.com/p/133029/TenantCloud/reviews/#4)
- Indians living abroad worry about encroachment on vacant property back home and get no real-time updates from caretakers. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#EqvLPHS2O)

**Why now:** Indians abroad own a growing share of urban flats, and cheap photo and reporting automation makes a monthly owner statement easy.

pain 3 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P225 · Small contractors lose track of pending site visits

Small trade and renovation contractors cannot see which customers were contacted or still need appointments, cannot batch-save job-site photos and lack the reporting larger firms get. Their software works on a phone but falls apart for office work. Homeowners meanwhile name unreliable contractors as the biggest barrier to upgrades, so every dropped follow-up costs the contractor trust and work.

**Challenge:** Give a two-person contractor a job book that keeps every customer, photo and follow-up straight from a phone.

Rare · for creators · global · teaches Mobile apps, Vision, Automation and integrations · also Work

<details><summary>Evidence (5) and scores (23)</summary>

- Small construction contractor needs more customisable features and stronger reporting from Jobber. [capterra, 2026-09-22](https://www.capterra.com/p/127994/Jobber/reviews/#1)
- Renovation project director lacks visibility into which customers were contacted or still need appointments. [capterra, 2026-08-18](https://www.capterra.com/p/127994/Jobber/reviews/#3)
- Owner of a small trades business finds Housecall Pro usable on mobile but a mess on desktop for office work. [capterra, 2026-06-04](https://www.capterra.com/p/140363/HouseCall-Pro/reviews/#2)
- Unreliable contractor quality is the biggest barrier for homeowners adopting heat pumps and similar upgrades. [hn, 2025-08-09](https://news.ycombinator.com/item?id=44847919)
- Small firm cannot batch-download job site photos and must save each image manually or via third-party tools. [capterra, 2025-05-07](https://www.capterra.com/p/140363/HouseCall-Pro/reviews/#4)

**Why now:** Home upgrades like heat pumps and solar grew in 2025, and contractor reliability became the bottleneck homeowners name.

pain 3 · frequency 4 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P230 · Field crews derailed by an update nobody announced

Small home-service contractors run crews on job software that lags with several jobs open, ships unannounced updates mid-job and has weak scheduling that disrupts the day. Independent repair professionals are stuck as third-party vendors on large aggregators, unable to get their own partner identity. The tradesperson does the work while someone else's system decides how the day goes.

**Challenge:** Let a solo tradesperson run their own bookings and schedule without depending on an aggregator's system.

Rare · for creators · global · teaches Mobile apps, Full-stack web · also Work

<details><summary>Evidence (5) and scores (22)</summary>

- Contractor office admin finds scheduling weak and occasional bugs disrupting daily crew workflow. [capterra, 2026-08-25](https://www.capterra.com/p/127994/Jobber/reviews/#2)
- Service business owner faces glitches and unannounced app updates that disrupt field crews mid-job. [capterra, 2026-07-22](https://www.capterra.com/p/127994/Jobber/reviews/#4)
- Small home facilities contractor says Housecall Pro's layout keeps getting worse, undermining otherwise solid job management features. [capterra, 2026-07-08](https://www.capterra.com/p/140363/HouseCall-Pro/reviews/#1)
- Contractor's job software lags and glitches when juggling multiple jobs at once. [capterra, 2026-04-10](https://www.capterra.com/p/140363/HouseCall-Pro/reviews/#3)
- Independent RO repair professional stuck as a third-party vendor on Urban Company, unable to get their own partner ID. [forum, 2025-09-06](https://www.consumercomplaints.in/urban-company-urban-company-partner-id-conversion-issue-need-support-c3534418)

**Why now:** Independent tradespeople in India and abroad increasingly want direct customers after aggregator fees rose in 2025.

pain 3 · frequency 4 · willingness 4 · buildability 3 · learning 3 · novelty 2 · openness 3

</details>

## Manufacturing and logistics

### P002 · Machine down and the only expert is days away

Small factories halt production for days after a breakdown because nothing connects them quickly with qualified repair technicians. Skilled trades take years to learn, technicians on the floor get little real-time guidance, and many cannot even complete a work order from a phone.

**Challenge:** Get a stalled machine diagnosed within the hour by the people already on the floor.

Mythic · for businesses · global · teaches Vision, Voice AI, Mobile apps · also Work

<details><summary>Evidence (3) and scores (28)</summary>

- Fleetio mobile app lacks many desktop features, so technicians in the yard cannot complete work orders from their phones. [capterra, 2026-04](https://www.capterra.com/p/120855/Fleetio/reviews/#2)
- Skilled physical trades take years to learn, and workers on the job get little real-time guidance when they hit something unfamiliar. [yc, 2026-02-03](https://www.ycombinator.com/rfs#spring-2026-ai-guidance-for-physical-work)
- Small factories halt production for days after a machine breakdown because no network connects them quickly with qualified repair technicians. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#vt5FZaOs0)

**Why now:** Multimodal models can now watch a live phone video and talk a technician through a fault.

pain 5 · frequency 3 · willingness 4 · buildability 3 · learning 5 · novelty 4 · openness 4

</details>

### P014 · Owed lakhs, afraid to ask the buyer for it

About ₹8.1 lakh crore owed to small suppliers sits in overdue buyer payments, yet most avoid complaints for fear of losing the customer. Filing through the online dispute route means assembling invoices and evidence nobody has time for, resolution is not time-bound, and polite reminders get ignored.

**Challenge:** Turn a supplier's overdue invoices into a ready-to-file claim in one evening, without burning the relationship.

Legendary · for businesses · India · teaches AI agents, Full-stack web · also Money

<details><summary>Evidence (5) and scores (28)</summary>

- Small Telangana suppliers wait months on overdue invoices and need help assembling claims to recover dues from buyers through the online dispute route. [news, 2026-09-23](https://yourstory.com/2026/09/msme-odr-portal-small-businesses-recover-delayed-payments)
- Weak payment discipline among large buyers keeps small enterprises waiting on dues, and existing dispute resolution has not been time-bound. [news, 2026-08-17](https://www.cnbctv18.com/business/msme-bill-could-be-an-ibc-moment-for-small-enterprises-facing-payment-delays-report-19971228.htm)
- About Rs 8.1 lakh crore owed to MSMEs is stuck in overdue buyer payments, and suing a buyer risks losing the relationship. [news, 2026-01-29](https://knnindia.co.in/news/newsdetails/msme/economic-survey-flags-delayed-payments-lack-of-access-to-formal-credit-as-key-challenges-for-msmes)
- Indian MSMEs wait well past the legal 45-day limit for buyer payments but avoid filing complaints for fear of losing the customer. [news, 2025-10-06](https://smestreet.in/infocus/delayed-payments-to-msmes-the-hidden-liquidity-crisis-india-must-urgently-fix-10533283)
- Polite payment reminders get ignored; small vendors find only a formal demand letter gets overdue invoices paid, which is costly to arrange. [hn, 2025-02-08](https://news.ycombinator.com/item?id=42985295)

**Why now:** Online dispute resolution for delayed payments is being pushed in 2026, but claim preparation is still manual.

pain 5 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 4 · openness 4

</details>

### P026 · Phantom kilos added to every parcel after it ships

Couriers re-weigh parcels after pickup and bill small online sellers for weight that was never there, sometimes two or three weeks later. Shipping aggregators rarely show photo proof and seldom reverse the charge, so the extra cost quietly eats into the margin on every order.

**Challenge:** Give a small seller proof of weight and size that wins the dispute before it starts.

Legendary · for businesses · India · teaches Vision, Data and dashboards · also Retail

<details><summary>Evidence (3) and scores (27)</summary>

- Shipping aggregator raises weight disputes two to three weeks after booking with no photo proof, and the seller cannot contest them. [other, 2026-03-28](https://www.trustpilot.com/review/nimbuspost.com#1)
- Seller says the courier inflated a 9 kg parcel to 13 kg and Shiprocket ignored the weight dispute, leaving extra charges in place. [capterra, 2025-06](https://www.capterra.com/p/159386/Shiprocket/reviews/#1)
- Weight discrepancy charges keep appearing on shipments and the aggregator's rates end up higher than going direct to courier partners. [capterra, 2025-02](https://www.capterra.com/p/159386/Shiprocket/reviews/#4)

**Why now:** Aggregators now run disputes through dashboards with short windows, and phone vision models can read a scale display and estimate box size reliably.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P038 · Small truck owners lose money to charges nobody approved

Small family truck operators, who move most of India's freight, are being squeezed as costs rise and earnings per trip shrink. On top of that come toll deductions while the truck is parked, autopay charges taken without clear consent and fees paid for load access that never delivered loads.

**Challenge:** Catch every wrong toll, autopay and fee on a truck owner's account and get it refunded.

Legendary · for creators · India · teaches Payments, Data and dashboards · also Travel

<details><summary>Evidence (4) and scores (27)</summary>

- Small family truck operators, who move most of India's freight, are struggling to stay viable as costs rise and earnings per trip shrink. [news, 2026-07-24](https://www.thehindubusinessline.com/economy/small-truckers-face-survival-crisis-even-as-they-move-70-of-indias-freight/article71263969.ece)
- Several toll deductions hit a FASTag while the truck was parked, and the refund request was rejected, leaving the owner out of pocket. [forum, 2026-03-29](https://blackbuck.pissedconsumer.com/review.html#2)
- Truck owner paid BlackBuck for load access after seeing loads listed, then received no loads for a month and no refund. [forum, 2025-12-23](https://blackbuck.pissedconsumer.com/review.html#1)
- Truck operator found recurring autopay charges deducted by the app without clear consent, and could not easily stop or reclaim them. [forum, 2025-12-07](https://blackbuck.pissedconsumer.com/review.html#3)

**Why now:** Tolling and freight payments went fully digital, so wrong debits now show up in messages a phone already receives.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 4 · openness 4

</details>

### P050 · Fake carriers with real paperwork are stealing whole loads

Hundreds of carriers and brokers can register at one mailbox and carrier numbers are cheap, so shippers cannot tell real carriers from impostors. Cargo theft through spoofed identities is rising, and brokers face liability for poor vetting without a quick way to check a carrier's identity and history.

**Challenge:** Tell a shipper in one minute whether the carrier on the phone is who they claim.

Legendary · for businesses · global · teaches AI agents, Data and dashboards

<details><summary>Evidence (3) and scores (26)</summary>

- Cargo stolen through fake carrier identities and spoofed brokers is rising, and small shippers and carriers have few tools to spot impostors. [news, 2026-09-06](https://www.overdriveonline.com/overdrive-radio/podcast/15834246/cargo-theft-by-fraud-white-house-task-force-freight-crime-in-spotlight)
- Freight brokers face liability for poor carrier vetting but lack a quick, reliable way to check a carrier's identity and history. [news, 2026-07-28](https://www.trucknews.com/transportation/brokers-rethink-carrier-selection-process-after-court-decisions/1003218934/)
- Hundreds of carriers and brokers register at one mailbox address and MC numbers are cheap, so shippers cannot tell real carriers from fraudsters. [hn, 2025-12-07](https://news.ycombinator.com/item?id=46181429)

**Why now:** Strategic cargo theft rose sharply in 2025 and 2026, and identity spoofing outran the manual checks brokers rely on.

pain 5 · frequency 4 · willingness 4 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P062 · Small export orders carry big-exporter paperwork

Low-value shipments make up a large share of shipping bills, yet small exporters carry the same paperwork and realisation-tracking burden as large ones. Reconciling many small export proceeds with banks is slow, and new labelling rules add material-safety proof to every shipment.

**Challenge:** Close every small export's paperwork and bank realisation without a full-time clerk.

Mythic · for businesses · India · teaches Automation and integrations, AI agents · also Money

<details><summary>Evidence (3) and scores (26)</summary>

- Importers face new labelling rules requiring proof that materials are free of toxic substances, adding paperwork to every shipment. [hn, 2026-09-27](https://news.ycombinator.com/item?id=49866349)
- Low-value shipments make up a large share of shipping bills, yet small exporters carried the same paperwork and realisation-tracking burden as large ones. [news, 2026-09-15](https://www.businessworld.in/article/dgft-eases-export-compliance-for-msmes-small-shipments-up-to-rs-3-lakh-624040)
- Small exporters struggle with reconciling export proceeds and closing bank compliance entries for many small-value trade transactions. [news, 2026-01-18](https://www.deccanchronicle.com/business/in-other-news/rbi-simplifies-small-value-trade-compliance-brings-relief-to-msme-exporters-1931299)

**Why now:** India is pushing small e-commerce exports, and document-reading models can now match shipping bills to bank credits cheaply.

pain 4 · frequency 4 · willingness 3 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P074 · Seller cash trapped inside the courier's wallet

Small online sellers prepay shipping into an aggregator wallet and wait on cash-on-delivery remittances, then watch unexplained deductions, add-on charges and frozen balances eat into that money. Support rarely explains a debit, and a frozen wallet stops further dispatches until it is sorted.

**Challenge:** Show a small seller every rupee the courier holds or took, and get the wrong ones back.

Epic · for businesses · India · teaches Payments, Automation and integrations · also Money

<details><summary>Evidence (3) and scores (25)</summary>

- Seller's pickup was delayed and money in the shipping wallet stayed frozen, blocking further dispatches. [other, 2026-07-13](https://www.trustpilot.com/review/nimbuspost.com#2)
- Shiprocket seller faced repeated unexplained wallet deductions and add-on charges, with support unable to explain or reverse them. [capterra, 2025-10](https://www.capterra.com/p/159386/Shiprocket/reviews/#2)
- Shopify seller using Shiprocket complains of slow support, disputed weight-based charges and delayed COD remittance hurting cash flow. [other, 2025-03-06](https://apps.shopify.com/reviews/1686375)

**Why now:** Cash on delivery still dominates small Indian online stores while aggregator add-on fees have multiplied, widening the gap between what was owed and what arrived.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P086 · Broken in transit, and the claim takes forever

Online sellers lose or see damaged a few percent of parcels in transit, and fragile goods suffer most because handling instructions are ignored. Claims drag on for weeks, insurance claims get denied for lack of evidence, and the seller usually absorbs the loss.

**Challenge:** Get a seller paid for a broken or lost parcel in days, not weeks.

Epic · for businesses · India · teaches Vision, Automation and integrations · also Retail

<details><summary>Evidence (5) and scores (25)</summary>

- Seller's insurance claim for parcels damaged in transit was denied, leaving them to absorb the loss. [other, 2026-09-11](https://www.trustpilot.com/review/shipstation.com#3)
- Parcel shipped through Shiprocket went missing in transit and nobody could say where it was or who would compensate. [forum, 2026-08-16](https://www.consumercomplaints.in/shiprocket-lost-shipment-c3544093)
- Online sellers lose or see damaged a few percent of parcels in transit, and courier claims drag on for weeks. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ZHZoph21C)
- Sellers of fragile goods face high breakage in transit because handling instructions are ignored and claims are tedious. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#lxtMLbRoW)
- Small seller's parcels were lost in transit through Shiprocket and no compensation was paid for the goods. [capterra, 2025-05](https://www.capterra.com/p/159386/Shiprocket/reviews/#3)

**Why now:** Phone video of packing is now trivial to store and timestamp, and vision models can flag the damage evidence a claims desk accepts.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P098 · Pickup today, says the message, every day

Small sellers get repeated pickup-scheduled messages while no courier arrives, so dispatch slips for days and buyers get angry. Prepaid shipping is not refunded, dashboards make rescheduling hard, and some shipments show no movement for weeks.

**Challenge:** Make sure a booked pickup happens the same day, or a different courier comes.

Epic · for businesses · India · teaches Automation and integrations, AI agents · also Retail

<details><summary>Evidence (4) and scores (25)</summary>

- Courier pickups for a small seller kept slipping despite repeated promises, delaying dispatch and upsetting buyers. [other, 2026-09-17](https://www.trustpilot.com/review/shiprocket.in#4)
- Sender kept getting pickup-today messages from Delhivery but no one came, and the prepaid shipping charge was not refunded. [forum, 2026-08-18](https://www.consumercomplaints.in/delhivery-failure-to-provide-service-for-shipment-and-refund-the-amount-paid-c3544138)
- Shipment booked through the aggregator had no pickup or tracking update for over three weeks. [other, 2026-08-08](https://www.trustpilot.com/review/nimbuspost.com#4)
- Scheduled courier pickups for a small seller were never completed, and buggy dashboards made rescheduling hard. [other, 2026-05-18](https://www.trustpilot.com/review/nimbuspost.com#3)

**Why now:** Multi-courier booking is now standard, so switching couriers on a missed pickup is possible if something watches for it.

pain 4 · frequency 4 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P110 · Truck downtime is the cost nobody writes down

Fleet owners rarely track vehicle downtime even though it is one of their largest hidden costs. Maintenance software promises to sync vehicle data automatically, but records still need manual cleanup and interface changes force staff to relearn how to log inspections and repairs.

**Challenge:** Show a fleet owner what each idle day costs, without anyone typing in more data.

Epic · for businesses · global · teaches Data and dashboards, Automation and integrations · also Travel

<details><summary>Evidence (3) and scores (25)</summary>

- Indian fleet owners face rising operating costs, with vehicle downtime a large hidden expense they rarely track or plan for. [news, 2026-06-24](https://auto.economictimes.indiatimes.com/news/industry/fleet-owners-navigate-rising-operating-costs-with-smarter-risk-management-strategies/131964444)
- Fleet manager says Fleetio's promised telematics sync did not reliably populate vehicle data, so maintenance records needed manual cleanup. [capterra, 2026-04](https://www.capterra.com/p/120855/Fleetio/reviews/#1)
- A Fleetio interface update disrupted a fleet team's routine and forced retraining of staff who log inspections and repairs. [capterra, 2026-02](https://www.capterra.com/p/120855/Fleetio/reviews/#3)

**Why now:** Phone-based telematics has made vehicle data cheap, yet small fleets still lack a view that turns it into money lost.

pain 4 · frequency 4 · willingness 4 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P122 · Only paid seats may report a broken machine

Plants can afford only a few full maintenance software seats, so occasional users pay full price or log repairs through someone else and data quality suffers. Software for field and maintenance crews has barely changed in two decades, even though most of the work happens away from a desk.

**Challenge:** Let anyone on the shop floor log a fault in ten seconds, without a licence.

Epic · for businesses · global · teaches Mobile apps, Voice AI · also Work

<details><summary>Evidence (3) and scores (25)</summary>

- Chemical plant could afford only a few full MaintainX seats, so other staff log maintenance work indirectly and data quality suffers. [capterra, 2026-08](https://www.capterra.com/p/179296/GetMaintainx/reviews/#1)
- Most workers are not at desks, yet software for construction, maintenance and field crews has barely changed in two decades. [yc, 2026-07-22](https://www.ycombinator.com/rfs#fall-2026-new-operating-systems-for-the-physical-world)
- Machinery firm pays full licence price for occasional users because MaintainX offers no shared or low-usage seat. [capterra, 2026-04](https://www.capterra.com/p/179296/GetMaintainx/reviews/#3)

**Why now:** Speech recognition now handles noisy floors and mixed languages, so a fault can be logged by talking rather than typing.

pain 3 · frequency 4 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P134 · Old custom software nobody left can repair

Small family businesses, and plenty of freight and travel firms, still depend on decades-old custom systems that nobody can repair when they break. Heavily customised ERPs become expensive to maintain, upgrades threaten costly redevelopment, and owners fear losing access to their own books.

**Challenge:** Rescue a small firm's old system and its data without a rewrite that stops the business.

Mythic · for businesses · global · teaches AI agents, Full-stack web · also Work

<details><summary>Evidence (4) and scores (25)</summary>

- Small business owners fear cloud accounting lock-in: the vendor can cut off access to their own books with no good offline alternative. [hn, 2026-06-15](https://news.ycombinator.com/item?id=48548705)
- Heavily customised Odoo became expensive to maintain, and each major version upgrade threatens large redevelopment and testing costs. [capterra, 2026-05](https://www.capterra.com/p/135618/Odoo/reviews/#1)
- Freight, travel and banking firms still run on old terminal systems, with modern screens merely layered on top. [hn, 2025-11-06](https://news.ycombinator.com/item?id=45830851)
- Small family businesses still depend on decades-old custom software that nobody can repair when something breaks. [hn, 2025-11-05](https://news.ycombinator.com/item?id=45824909)

**Why now:** Coding agents in 2025 and 2026 can read and explain legacy code, which makes modernising a small system affordable.

pain 4 · frequency 2 · willingness 4 · buildability 3 · learning 4 · novelty 4 · openness 4

</details>

### P145 · Fixed-price orders meet metal prices that never sit still

Small engineering, plastics and component makers quote fixed prices weeks before buying aluminium, copper, steel or polymer, then watch input costs jump. Margins on orders already won vanish, and metal buyers can wait months for material they cannot buy direct from mills.

**Challenge:** Help a small manufacturer quote and buy so that a price spike cannot wipe out an order.

Legendary · for businesses · India · teaches Data and dashboards, AI agents

<details><summary>Evidence (5) and scores (25)</summary>

- Coimbatore small manufacturers face aluminium shortages and rising input costs, with little ability to plan purchases or pass on price swings. [news, 2026-10-05](https://www.alcircle.com/news/coimbatore-msmes-seek-easier-aluminium-scrap-imports-amid-raw-material-pressure-121437)
- Small railway-component suppliers are locked into fixed-price contracts while raw material costs surge, eroding margins on orders already won. [news, 2026-04-17](https://timesofindia.indiatimes.com/city/coimbatore/msme-railway-suppliers-seek-relief-amid-surge-in-raw-material-costs/articleshow/130338790.cms)
- Small plastics processors are hit by sudden polymer price hikes tied to West Asia tensions, threatening viability of existing orders. [news, 2026-03-15](https://www.thehindubusinessline.com/companies/msme/west-asia-conflict-plastics-manufacturers-raise-concerns-about-polymer-price-hikes-seek-survival-package-for-msme-units/article70746267.ece)
- Domestic metal buyers wait eight to thirty weeks for rolled metal and often cannot buy direct from mills. [yc, 2026-02-03](https://www.ycombinator.com/rfs#spring-2026-modern-metal-mills)
- Sharp jumps in aluminium, copper and steel prices are squeezing small engineering units that quote prices weeks before buying material. [news, 2026-01-28](https://timesofindia.indiatimes.com/city/coimbatore/codissia-urges-centre-to-control-raw-material-prices-to-protect-msmes/articleshow/127716506.cms)

**Why now:** Metal and polymer prices swung sharply in 2026 with trade and West Asia tensions, catching small units mid-contract.

pain 5 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P156 · Chasing suppliers by phone, one invoice at a time

About two-thirds of small firms struggle to manage multiple suppliers, and half report constant follow-ups and invoices that fail GST checks, blocking input credit. Complex supply chains still run on spreadsheets and phone calls, so disruptions beyond direct suppliers go unseen.

**Challenge:** Take supplier follow-ups and invoice fixes off a small owner's phone entirely.

Epic · for businesses · India · teaches AI agents, Automation and integrations · also Money

<details><summary>Evidence (3) and scores (25)</summary>

- LocalCircles survey finds about two-thirds of MSMEs struggle to manage multiple suppliers, with non-compliant invoices and price swings also common. [news, 2026-06-26](https://www.businessworld.in/article/digital-procurement-gains-pace-as-msmes-battle-supply-hurdles-localcircles-612331)
- Half of MSMEs report ongoing trouble with supplier follow-ups and invoices that fail GST compliance checks, blocking input credit. [news, 2026-06-26](https://www.aninews.in/news/business/world-msme-day-2026-5-in-10-msmes-continue-to-face-supplier-management-and-invoice-compliance-challenges-digital-procurement-adoption-accelerating20260626140851/)
- Complex manufacturing supply chains are run on spreadsheets and phone calls, so firms cannot see disruptions beyond direct suppliers. [yc, 2026-04-28](https://www.ycombinator.com/rfs#summer-2026-supply-chain-for-semiconductors)

**Why now:** Stricter GST invoice matching makes a bad supplier invoice cost real credit, and agents can now chase suppliers over messaging.

pain 3 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P166 · Load boards full of stale and phantom freight

Owner-operators pay rising subscriptions for load boards that show stale posts, the same load reposted by competing brokers, and fewer listings after unexplained algorithm changes. New carriers cannot get booked for months and brokers are shifting to fixed trusted partners, leaving one-truck operators without steady freight.

**Challenge:** Help a one-truck carrier find real, bookable loads without paying for noise.

Epic · for creators · global · teaches Data and dashboards, Full-stack web · also Travel

<details><summary>Evidence (5) and scores (25)</summary>

- Carriers on DAT see the same load reposted by competing brokers and complaints about it bring no enforcement, wasting calls and time. [other, 2026-09-30](https://www.trustpilot.com/review/www.dat.com#1)
- Small carriers relying on spot load boards struggle as brokers shift to fixed trusted partners, leaving one-truck operators without steady freight. [news, 2026-09-24](https://www.fleetowner.com/operations/article/55397903/the-for-hire-market-is-rewriting-broker-carrier-relations)
- New-authority owner-operators pay for the DAT load board but brokers will not book them until six months in, so the subscription is useless. [other, 2026-09-04](https://www.trustpilot.com/review/www.dat.com#2)
- After an algorithm change, a paying carrier saw far fewer loads on DAT, with no explanation of what is hidden or why. [other, 2026-08-08](https://www.trustpilot.com/review/www.dat.com#3)
- Load board shows stale posts and frozen listings and crashes, while pricing keeps rising with few alternatives for small carriers. [other, 2026-02-27](https://www.trustpilot.com/review/www.dat.com#4)

**Why now:** Freight rates stayed weak into 2026 while brokers consolidated around trusted carriers, so small operators lean on load boards more and get less.

pain 4 · frequency 5 · willingness 4 · buildability 3 · learning 3 · novelty 3 · openness 3

</details>

### P176 · Hauled the load, then the broker vanished

Owner-operators haul loads that were secretly re-brokered, then go unpaid when the middleman disappears. Wrong charges take months to resolve and unexplained account holds freeze earnings for a week, so one dispute can cost the loads a small carrier needs to stay afloat.

**Challenge:** Make sure a small carrier knows who is really paying before the truck is loaded.

Legendary · for creators · global · teaches AI agents, Payments · also Money

<details><summary>Evidence (3) and scores (25)</summary>

- Carrier was wrongly charged thousands on a brokered load and waited three months for the billing dispute to be resolved. [other, 2026-08-20](https://www.trustpilot.com/review/truckstop.com#3)
- Owner-operators haul loads that were secretly re-brokered, then go unpaid when the middleman vanishes, forcing slow court fights to recover money. [news, 2026-08-17](https://www.overdriveonline.com/business/article/15832732/courts-cracking-down-on-double-brokers-with-two-important-cases)
- An unexplained lien hold froze a carrier's account for a week, making them miss loads while support kept promising 24 hours. [other, 2026-04-20](https://www.trustpilot.com/review/truckstop.com#4)

**Why now:** Double brokering surged with cheap identities in 2025 and 2026, and public registration data can now be checked automatically.

pain 5 · frequency 3 · willingness 4 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P185 · Small sellers pay the steepest courier rates going

Online sellers spend up to an hour a day comparing courier prices across zones and weight slabs, and still pay full rates that large shippers never see. Returns and replacements cost even more to ship than forward orders, and discounted aggregator rates can end up above going direct.

**Challenge:** Cut what a small seller pays per parcel without adding an hour of rate-checking to their day.

Rare · for businesses · India · teaches Data and dashboards, Full-stack web · also Retail

<details><summary>Evidence (4) and scores (24)</summary>

- Small merchant found ShipStation's discounted shipping rates about 40 percent above going direct to the carrier. [other, 2026-09-18](https://www.trustpilot.com/review/shipstation.com#2)
- Online sellers spend up to an hour a day comparing courier rates with complex zone and weight pricing. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#dG_Hsaobx)
- Returns and replacements cost small sellers far more to ship than forward orders, eroding thin margins. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#P_MfKW30c)
- Small online sellers pay full courier rates while large sellers enjoy steep volume discounts. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#cSfros2yH)

**Why now:** Courier networks have multiplied and published granular rate cards, so choosing well per parcel, or pooling volume, matters more than before.

pain 3 · frequency 5 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P193 · Delivery attempted, says the courier who never rang

Last-mile agents log failed delivery attempts without calling or visiting, so parcels bounce back and orders get cancelled while the buyer sat at home. Tracking status stops being trustworthy, and the buyer has to reorder, wait for a refund and chase support that cannot help.

**Challenge:** Make a false delivery attempt cost the courier, not the buyer waiting at home.

Epic · for consumers · India · teaches Voice AI, Automation and integrations · also Retail

<details><summary>Evidence (5) and scores (24)</summary>

- Order was cancelled and returned without any genuine delivery attempt, leaving the buyer to reorder and wait for a refund. [other, 2026-09-16](https://www.trustpilot.com/review/xpressbees.com#3)
- Xpressbees agents log a single missed ring as a failed delivery attempt, so parcels bounce back without the buyer ever being reached. [other, 2026-09-10](https://www.trustpilot.com/review/xpressbees.com#1)
- Last-mile agent logged a failed delivery attempt without calling the customer, delaying the order and making tracking status untrustworthy. [forum, 2026-04-11](https://www.consumercomplaints.in/shiprocket-false-delivery-attempt-and-late-delivery-c3540758)
- Delivery staff recorded customer unavailable though the buyer was home, so the shipment was never delivered and support gave no fix. [forum, 2026-01-10](https://www.consumercomplaints.in/shiprocket-non-delivery-of-order-despite-incorrect-remark-by-delivery-personnel-c3538662)
- Order was cancelled without consent after repeated failed delivery attempts the customer says never happened. [forum, 2025-09-03](https://www.consumercomplaints.in/shiprocket-order-mb0164493805-not-yet-received-c3534305)

**Why now:** Cheap voice agents can now call a buyer before an attempt and record the outcome, creating independent proof that never existed.

pain 3 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P201 · Return to origin bills the seller twice for nothing

Parcels come back to small sellers marked return to origin after attempts that never happened, so the seller pays shipping both ways and loses the sale. Wrong or damaged returns arrive, claims are denied without a clear evidence process, and lost return parcels stay unrefunded for weeks.

**Challenge:** Cut a small seller's return-to-origin losses by half within a month.

Rare · for businesses · India · teaches Data and dashboards, Automation and integrations · also Retail

<details><summary>Evidence (4) and scores (24)</summary>

- Seller's return parcel stayed lost for weeks and the shipping aggregator kept delaying any refund or claim settlement. [other, 2026-09-30](https://www.trustpilot.com/review/shiprocket.in#2)
- Courier aggregated by Shiprocket marked a fake delivery attempt without ever reaching the buyer, leaving the parcel stuck and the customer with no recourse. [forum, 2026-09-25](https://www.consumercomplaints.in/shiprocket-parcel-not-delivered-and-updating-fake-delivery-attempt-c3545044)
- Several parcels marked RTO after fake delivery attempts, so the seller pays both ways and loses the sale while support stays unhelpful. [other, 2026-09-22](https://www.trustpilot.com/review/shiprocket.in#3)
- Small seller got a wrong return-to-origin shipment back via Shiprocket and Xpressbees, then had the loss claim denied with no clear evidence process. [forum, 2025-07-18](https://www.consumercomplaints.in/shiprocket-complaint-against-shiprocket-xpressbees-for-wrong-rto-shipment-and-denial-of-claim-c3532130)

**Why now:** Return rates on cash-on-delivery orders keep rising as small online stores multiply, and automated calls and messages make pre-dispatch confirmation affordable.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 3 · novelty 2 · openness 3

</details>

### P209 · Parcels stuck in the hub with nobody answering

Parcels reach the destination city and then sit or loop between hubs for days or weeks, with no updates and no office number that answers. Shippers lose clients when shipments go untraceable mid-route, and no escalation path reaches a person who can find the box.

**Challenge:** Find a stuck parcel and get it moving within forty-eight hours of it going quiet.

Epic · for consumers · India · teaches AI agents, Data and dashboards · also Retail

<details><summary>Evidence (5) and scores (24)</summary>

- Delhivery parcel sat stuck for about two weeks while the recipient could not reach anyone in support to find or release it. [other, 2026-10-04](https://www.trustpilot.com/review/delhivery.com#1)
- Small seller's shipments through Shiprocket became untraceable mid-route, costing them clients with no accountability from the aggregator. [other, 2026-10-01](https://www.trustpilot.com/review/shiprocket.in#1)
- Parcel sat undelivered in the destination city for over two weeks with no updates and no office number to call. [other, 2026-08-31](https://www.trustpilot.com/review/xpressbees.com#2)
- Parcel reached the destination city but kept being rerouted between hubs for days without any delivery attempt. [forum, 2026-08-18](https://www.consumercomplaints.in/delhivery-urgent-package-not-delivered-despite-reaching-city-on-13th-august-c3544130)
- Freight consignment stuck untraceable at a Delhivery branch, with the branch unreachable and no escalation path for the shipper. [forum, 2026-06-01](https://www.consumercomplaints.in/delhivery-lr-305016559-urgent-escalation-shipment-delayed-and-not-traceable-at-pune-branch-c3542228)

**Why now:** Parcel volumes keep climbing with festival peaks while courier support has moved to bots that cannot find a box.

pain 3 · frequency 4 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P217 · Job shops run production on spreadsheets and hope

Small job shops and assembly plants find generic ERPs cannot handle routings, work orders and mixed production, so they fall back on spreadsheets. Parts held across several locations at different costs are hard to track, and customising off-the-shelf systems turns into a costly project.

**Challenge:** Let a twenty-person job shop see every order's stage and material without a six-month rollout.

Epic · for businesses · global · teaches Full-stack web, Data and dashboards

<details><summary>Evidence (4) and scores (24)</summary>

- ERP projects for small firms bog down in costly customisation because off-the-shelf systems do not fit their industry workflows. [hn, 2026-04-01](https://news.ycombinator.com/item?id=47607202)
- MaintainX parts inventory cannot track one part across several locations with different costs, complicating spare-parts control on the shop floor. [capterra, 2026-04](https://www.capterra.com/p/179296/GetMaintainx/reviews/#2)
- Small maker workshops are stuck between spreadsheets and costly ERP software when tracking materials, stock and purchases. [hn, 2026-03-13](https://news.ycombinator.com/item?id=47368293)
- Job shops and small assembly plants find generic ERPs cannot handle routings, work orders and mixed production, so they fall back on spreadsheets. [hn, 2025-08-05](https://news.ycombinator.com/item?id=44793215)

**Why now:** AI coding tools have cut the cost of vertical software, making systems built for one kind of shop viable.

pain 4 · frequency 5 · willingness 4 · buildability 3 · learning 3 · novelty 2 · openness 3

</details>

### P222 · Outgrew the accounting package, cannot afford the ERP

Small goods businesses outgrow entry-level accounting and inventory software, hitting order caps, drifting stock counts and integrations locked behind higher tiers. A traditional ERP costs too much and takes months, so they keep reconciling by hand.

**Challenge:** Keep stock counts right across sales channels and books, without moving to an ERP.

Rare · for businesses · global · teaches Automation and integrations, Data and dashboards · also Retail

<details><summary>Evidence (4) and scores (24)</summary>

- Small manufacturers have outgrown QuickBooks but cannot afford the cost or months of a traditional ERP rollout. [hn, 2026-06-15](https://news.ycombinator.com/item?id=48539494)
- Key integrations and advanced inventory features sit behind higher Zoho tiers, so costs jump as a small business grows. [capterra, 2026-06](https://www.capterra.com/p/146241/Zoho-Inventory/reviews/#4)
- Zoho Inventory stock-level updates still need manual admin work, so counts drift unless someone keeps reconciling them. [capterra, 2026-05](https://www.capterra.com/p/146241/Zoho-Inventory/reviews/#1)
- Small goods business hits monthly order caps in Zoho Inventory and struggles to connect it to a non-Zoho accounting package. [capterra, 2026-02](https://www.capterra.com/p/146241/Zoho-Inventory/reviews/#3)

**Why now:** Open interfaces on sales channels and accounting systems make a thin sync layer cheaper than a full ERP.

pain 3 · frequency 4 · willingness 4 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P227 · Slow quick pay, expensive factoring, one-truck carriers stuck

Small carriers rely on factoring and quick pay to cover fuel and payroll, yet payments promised next day arrive three to seven days later while documents are verified. Factoring eats a large fee just to reach money already owed, so the cheap cash is never fast and the fast cash is never cheap.

**Challenge:** Get a small carrier paid within a day of delivery for less than a factoring fee.

Epic · for creators · global · teaches Payments, Automation and integrations · also Money

<details><summary>Evidence (3) and scores (24)</summary>

- Small carrier says most factoring payment submissions through Truckstop's platform arrive almost a week late, straining fuel and payroll cash. [other, 2026-06-23](https://www.trustpilot.com/review/truckstop.com#1)
- Quick-pay promised next day but document verification takes three to five days, so carriers cannot rely on when they get paid. [other, 2025-12-02](https://www.trustpilot.com/review/truckstop.com#2)
- Invoice factoring to bridge unpaid receivables eats a large fee, so small firms pay heavily just to access money already owed. [hn, 2025-07-06](https://news.ycombinator.com/item?id=44477358)

**Why now:** Document models can now check freight paperwork in seconds, removing the main reason quick pay is slow.

pain 4 · frequency 5 · willingness 4 · buildability 3 · learning 3 · novelty 2 · openness 3

</details>

### P232 · The truck never came and nobody knows why

Small manufacturers book local transporters who fail to turn up, leaving finished goods stuck at the factory and delivery deadlines missed. Regional transporters give no live tracking and pickup details pass through several hands, so customers keep calling and delays turn into storage fees.

**Challenge:** Give a small factory and its buyer a live view of every regional truck booking.

Legendary · for businesses · India · teaches Mobile apps, Automation and integrations

<details><summary>Evidence (3) and scores (23)</summary>

- Small manufacturers miss delivery deadlines when local transporters fail to turn up for booked pickups, leaving goods stuck at the factory. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#rpjP1OFaJ)
- Businesses using regional transporters get no live tracking, so customers keep calling for delivery updates. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#R_vnFfDbK)
- Container pickup numbers pass through owner, forwarder, broker and trucker before reaching the driver, so delays trigger storage fees. [hn, 2024-10-08](https://news.ycombinator.com/item?id=41777987)

**Why now:** Nearly every truck driver now carries a smartphone with data, so tracking can ride on a shared link rather than a device.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 3 · novelty 3 · openness 4

</details>

## Fashion and beauty

### P011 · Thirty percent of fashion orders come back

Indian fashion sellers see 25 to 40 percent of online orders returned, most of them for size, and festive cash-on-delivery orders bounce far more often than prepaid ones. Every return costs shipping both ways, inspection and often the garment's resale value, and new rules abroad make returns harder to simply destroy.

**Challenge:** Cut a fashion brand's size returns by a third within one season.

Epic · for businesses · India · teaches Data and dashboards, AI agents · also Retail

<details><summary>Evidence (3) and scores (26)</summary>

- Indian brands borrowed US/UK size charts, so a 32 in one label is a 34 elsewhere; most brands see ~30% returns, mainly sizing. [news, 2026-09-25](https://www.forbesindia.com/article/life/measuing-up-indias-search-for-the-right-fit/2998714/1)
- Indian fashion e-commerce returns run 25-40%; most shoppers guess their size, and festive COD orders bounced 58% versus under 15% prepaid. [other, 2026-08-15](https://www.firstresort.in/blogs/research/fashion-ecommerce-returns-rto-india-2026)
- New EU rules push apparel retailers to inspect and handle returns rather than destroy them, raising the cost of high return rates. [hn, 2026-07-18](https://news.ycombinator.com/item?id=48960270)

**Why now:** Return reasons and order data now sit in every online store's back end, and cheap models can link fit complaints to individual products automatically.

pain 5 · frequency 5 · willingness 4 · buildability 3 · learning 4 · novelty 2 · openness 3

</details>

### P023 · Spotting a fake lipstick only after it burns

Counterfeit cosmetics reach buyers through large marketplaces, and most people discover the fake only after using it, when the return window has closed. The only reliable check is comparing packaging against a store-bought original, and neither brands nor marketplaces respond to reports.

**Challenge:** Let a buyer check whether a beauty product is genuine within a minute of unboxing it.

Mythic · for consumers · India · teaches Vision, Mobile apps · also Health

<details><summary>Evidence (3) and scores (26)</summary>

- Shopper only spotted counterfeit cosmetics from a marketplace by comparing packaging with a store-bought original; neither brand nor marketplace responded. [hn, 2026-08-30](https://news.ycombinator.com/item?id=49504104)
- Buyer suspected a Nykaa moisturiser was counterfeit only after use, but the return window had closed and refund was refused. [other, 2026-06-27](https://www.consumercomplaints.in/nykaa-com-request-to-reopen-return-window-and-process-refund-order-id-nyk-3608084848328765registered-mobile-number-81263-86847-c3542973)
- Shopper believes counterfeit brands are listed on Nykaa and had to re-explain the problem repeatedly to support without resolution. [other, 2025-12-24](https://www.trustpilot.com/review/nykaa.com#4)

**Why now:** Vision models can now pick out fine print and print-quality differences from a phone photo, and counterfeit beauty complaints keep rising.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 5 · novelty 4 · openness 4

</details>

### P035 · Empty-box returns small sellers cannot disprove

Small marketplace sellers lose money to wrong-item, tampered and empty-box returns, but without proof of what they packed fewer than a quarter of claims succeed, and appealing can get the account suspended. Buyers face the mirror image when items arrive damaged or short in a sealed box, with no way to show what was inside.

**Challenge:** Give a small seller proof of what went into every parcel that a marketplace will actually accept.

Epic · for creators · India · teaches Vision, Mobile apps · also Retail

<details><summary>Evidence (5) and scores (26)</summary>

- Small Meesho apparel sellers lose money to wrong-item and empty-box returns; without packing proof, under a quarter of claims succeed. [other, 2026-06-22](https://trackvid.in/blogs/meesho-seller-return-fraud-india.html)
- Meesho fashion sellers find 5-12% of returns are wrong or tampered items, but must file photo-heavy claims within 48-72 hours or absorb the loss. [other, 2026-06-15](https://trackecom.in/blog/meesho-wrong-return-claim-how-to-file-and-win-every-return-dispute)
- Bookstore customer twice received damaged books and found the chain's return process worse than ordering online. [hn, 2026-04-21](https://news.ycombinator.com/item?id=47851171)
- Three lipsticks missing from a delivered Nykaa beauty order; shopper has no easy way to prove short shipment from a sealed box. [other, 2026-04-15](https://www.consumercomplaints.in/nykaa-items-missing-from-the-order-delivered-c3540850)
- Reseller who received wrong items back on returns had claims denied for 'high claim ratio', then the seller account was suspended for appealing. [other, 2024-11-09](https://voxya.com/consumer-complaints/not-giving-claim-for-wrong-returns-/238575)

**Why now:** Marketplaces tightened claim windows to 48 to 72 hours and demand photo evidence, and phones can now record and tag a packing video per order for free.

pain 4 · frequency 4 · willingness 4 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P047 · Confirmed salon slots that still mean a half-hour wait

Salon scheduling is still done by hand and ignores how long each service takes, so customers with confirmed slots wait and regulars get whichever stylist is free. No-shows cost Indian salons four to five appointments a day, and when a stylist is out every affected client has to be called one by one.

**Challenge:** Cut a salon's no-shows and waiting time in half without adding a receptionist.

Rare · for businesses · India · teaches Voice AI, Automation and integrations

<details><summary>Evidence (4) and scores (25)</summary>

- When a stylist is out, salons must manually reschedule and contact every affected client, a bulk task booking tools handle poorly. [hn, 2026-08-02](https://news.ycombinator.com/item?id=49139997)
- Indian salons lose four to five appointments daily to no-shows, over Rs 70,000 a month, alongside stylist poaching and product pilferage. [other, 2026-02-10](https://dingg.app/blogs/top-challenges-faced-by-indian-salon-owners--and-how-technology-can-solve-them)
- Salon customers with confirmed slots still wait half an hour because scheduling is manual and ignores how long services take. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#EZZGgnI49)
- Salon customers get whichever stylist is free rather than the one they trust, so results are inconsistent visit to visit. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ggp_shoQw)

**Why now:** Voice agents that speak Hindi and regional languages became cheap enough in 2025 to call every client to confirm or move a booking.

pain 4 · frequency 5 · willingness 3 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P059 · Bridal slots booked in DMs, lost to ghosting

Freelance makeup artists, mehendi artists and saree drapers take bookings through direct messages with no deposit, contract or trial, so one ghosted wedding slot wipes out a full day's income. Customers face the mirror image: no way to find a skilled freelancer at short notice, and nothing to fall back on when a ₹2 lakh look goes wrong.

**Challenge:** Make booking a freelance beauty professional as binding as booking a salon, with a deposit, a trial and a findable profile.

Legendary · for creators · India · teaches Payments, Mobile apps, Automation and integrations · also Creators

<details><summary>Evidence (6) and scores (24)</summary>

- Freelance makeup artists take bookings via Instagram DMs with no deposit, so a ghosted multi-hour bridal slot wipes out a full day's income. [other, 2026-06-20](https://nextroapp.com/blog/makeup-artist-booking-software)
- Working women struggle to book a skilled saree-draping helper who can come home early on short notice before an event. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#CDEcRAu1J)
- Families planning small home functions find mehendi artists either booked for weddings or charging full wedding-season rates. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#Z4c9m89Rg)
- Elderly people and those with limited mobility rarely find beauticians offering home visits at reasonable prices. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#ZtTHTB0sX)
- Independent beauty professionals burn out on admin: manual appointments, cancellations, client follow-ups and keeping social media posting consistent. [hn, 2025-04-22](https://news.ycombinator.com/item?id=43760884)
- Bride paid Rs 2.2 lakh for bridal makeup that turned cakey; no pre-booking trial or contract covered quality or photo-posting consent. [news, 2025-04-03](https://www.bollywoodshaadis.com/articles/bride-paid-rs-2-lakhs-for-bridal-makeup-62295)

**Why now:** UPI payment links make a small deposit almost free to collect, and freelance beauty discovery has moved onto social media, where nothing is binding.

pain 4 · frequency 3 · willingness 3 · buildability 4 · learning 3 · novelty 3 · openness 4

</details>

### P071 · Foundation that looks wrong by noon

Indian buyers routinely order several wrong foundation shades online because undertone and oxidation are invisible in product photos, and bridal artists often apply one standard look to darker skin. Skincare formulated for cooler climates irritates or underperforms in Indian heat and pollution, so money goes on products that never suit.

**Challenge:** Help someone find a shade and a routine that actually work on their skin before they spend a rupee.

Epic · for consumers · India · teaches Vision, Mobile apps · also Retail

<details><summary>Evidence (3) and scores (24)</summary>

- Indian buyers often purchase several wrong foundation shades online; undertone mismatch and oxidation make it look wrong by noon. [other, 2026-03-10](https://houseofmakeup.com/blogs/post/how-to-match-foundation-shade-for-indian-skin-without-buying-three-wrong-ones-first)
- Brides with darker or varied skin tones find makeup artists apply one standard look instead of matching their shade and undertone. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#M1IwUM30a)
- Imported skincare often underperforms or irritates skin in Indian humidity and pollution because formulas target cooler climates. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#UqtENaVwA)

**Why now:** Phone cameras and open vision models can now estimate undertone under ordinary light, and beauty shopping in India has moved online.

pain 3 · frequency 3 · willingness 3 · buildability 4 · learning 5 · novelty 3 · openness 3

</details>

### P083 · Fakes shipped from the official store

Commingled marketplace inventory means a beauty product bought from a brand's own storefront or a curated mall section can still ship as a fake, old or used item. Four in ten Indian cosmetics buyers have hit counterfeits in three years, a quarter of them with allergic reactions, and trust in every seller suffers.

**Challenge:** Show a beauty buyer where a specific unit came from before it reaches their skin.

Mythic · for consumers · India · teaches Data and dashboards, Full-stack web · also Retail, Health

<details><summary>Evidence (3) and scores (24)</summary>

- 40% of Indian cosmetics buyers hit counterfeits in three years, online platforms the top source; a quarter reported allergic reactions. [other, 2026-08-14](https://www.localcircles.com/a/press/page/counterfeit-cosmetics-survey)
- Cosmetics bought on Meesho Mall arrived old, used and in deteriorated packaging, leaving the buyer suspecting counterfeits from a 'trusted' section. [other, 2026-06-19](https://www.trustpilot.com/review/meesho.com?page=5#1)
- Commingled marketplace inventory means even cosmetics bought from a brand's official storefront may ship as fakes, eroding buyer trust. [hn, 2025-01-12](https://news.ycombinator.com/item?id=42676280)

**Why now:** Batch codes are printed on most cosmetics and buyers are posting fakes publicly, so a shared record of which sellers ship what is finally feasible.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 3 · novelty 4 · openness 4

</details>

### P095 · Beauty products delivered half expired or already opened

Online beauty and grocery buyers cannot see a manufacturing or best-before date before ordering, so skincare arrives with half its shelf life gone and bread with a day left. Opened or tampered items are refused for return, leaving the buyer unsure whether they received something used, fake or simply old.

**Challenge:** Make the shelf life and seal of every beauty order visible before payment and provable after delivery.

Epic · for consumers · India · teaches Vision, Mobile apps · also Retail

<details><summary>Evidence (5) and scores (24)</summary>

- Purplle delivered an opened, used lipstick and refused the return, leaving the buyer with an unhygienic product and no refund. [other, 2026-07-31](https://www.trustpilot.com/review/purplle.com#1)
- 48% of online grocery shoppers can't find best-before dates before buying and report near-expiry items like bread with one day left. [other, 2026-06-22](https://www.localcircles.com/a/press/page/ecommerce-best-before-date-non-compliance)
- Perfume arrived with a tampered, opened seal; Nykaa denied the return, leaving the buyer unsure if it was used or fake. [other, 2026-05-26](https://www.consumercomplaints.in/nykaa-com-received-perfume-with-tampered-seal-refund-denied-by-nykaa-c3542088)
- Buyers of cosmetics on marketplaces fear receiving fakes or expired stock because authenticity is hard to verify. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#oDINRMssQ)
- Skincare arrived with 13 of its 24 months of shelf life already gone; buyers cannot see manufacturing date before ordering beauty online. [other, 2025-12-07](https://www.trustpilot.com/review/nykaa.com#1)

**Why now:** Consumer protection rules now push sellers to show more product details online, and phone vision can read printed dates reliably.

pain 3 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 4

</details>

### P107 · Weavers paid a quarter of a shopkeeper's wage

Handloom weavers sell through seasonal fairs and middlemen at prices that barely cover costs, lose ground to powerloom copies, and have no online presence of their own. Building one is hard, because website builders and online stores assume design and technical skills that weavers and small shop owners do not have.

**Challenge:** Let a weaver put a piece up for sale online, from a phone, in their own language, in five minutes.

Epic · for creators · India · teaches Voice AI, Mobile apps, Full-stack web · also Creators, Retail

<details><summary>Evidence (3) and scores (24)</summary>

- Small shop owners want a simple web presence but find website builders demand design and technical skills they lack. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#Qi6dlecOj)
- Rural Indian weavers depend on seasonal fairs and middlemen to sell, getting prices that barely cover costs and income that swings by season. [other, 2025-08-28](https://tisserindia.com/how-technology-is-spinning-new-hope-for-rural-weavers/)
- Indian handloom weavers earn a quarter of shopkeeper wages, lose margin to middlemen and powerloom copies, and lack digital skills to sell online. [other, 2025-03-28](https://aakhya.substack.com/p/the-aakhya-weekly-140-fraying-threads)

**Why now:** Speech recognition in Indian languages and photo-to-listing models now let someone with no typing skills create a listing by speaking.

pain 5 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 2 · openness 3

</details>

### P119 · Salon back offices still run on hand calculations

Salons that switch software lose financial history in botched migrations, struggle to set up loyalty and membership rules, and get only a chatbot when billing breaks. Many owners still calculate staff commissions and attendance by hand and spend over ten hours a month reconciling tax, which breeds disputes with stylists.

**Challenge:** Make a salon's month-end close, commissions and tax included, take one hour and end with no staff disputes.

Epic · for businesses · global · teaches Automation and integrations, Data and dashboards · also Work, Money

<details><summary>Evidence (5) and scores (23)</summary>

- Spa staff find setting up promotions, loyalty rewards and membership rules in Zenoti unintuitive and multi-step, so offers go unused or misconfigured. [capterra, 2026-06-30](https://www.capterra.com/p/131057/ZENOTI/reviews/#2)
- Salon chain's migration to Zenoti was chaotic: financial data mapped wrongly and billing corrections were blocked, disrupting daily operations. [capterra, 2026-04-14](https://www.capterra.com/p/131057/ZENOTI/reviews/?page=2)
- Indian salon owners spend 10+ hours monthly on GST reconciliation and face recurring staff disputes from hand-calculated commissions and paper attendance. [other, 2026-03-07](https://dingg.app/blogs/7-signs-your-salon-needs-automation-in-2026)
- Salon owner on Zenoti says support is only an AI bot and slow chat, so urgent booking or billing issues sit unresolved for hours. [capterra, 2026-01-27](https://www.capterra.com/p/131057/ZENOTI/reviews/#1)
- Spa business launched on new salon software before data migration and staff training were ready, causing operational failures and unresolved tickets. [capterra, 2025-05-15](https://www.capterra.com/p/131057/ZENOTI/reviews/?page=3)

**Why now:** Language models can now read messy exports from old salon systems and map them into a new structure, which is exactly where migrations break.

pain 3 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P131 · Size charts locked inside software you rent

Small online clothing stores pay rising per-order fees for size-chart add-ons, cannot export the charts they built, and sometimes discover the recommender silently stopped working weeks ago. The guidance shoppers do see, a model's height and size or a virtual try-on, is too crude to trust, so returns stay high.

**Challenge:** Give a small clothing store fit guidance it owns, that never silently breaks and costs nothing per order.

Epic · for businesses · global · teaches Full-stack web, Vision · also Retail

<details><summary>Evidence (5) and scores (23)</summary>

- Small apparel store on Shopify saw its size-chart app downgrade plan limits and add per-order fees, so fit guidance costs scale with sales. [other, 2026-08-22](https://apps.shopify.com/kiwi-sizing/reviews?ratings%5B%5D=1&ratings%5B%5D=2&ratings%5B%5D=3#1)
- Fashion merchant cannot export years of size charts they built inside a sizing app, locking them in as prices rise. [other, 2026-04-25](https://apps.shopify.com/kiwi-sizing/reviews?ratings%5B%5D=1&ratings%5B%5D=2&ratings%5B%5D=3#2)
- Listing a model's height and size gives poor fit guidance since body proportions differ, driving avoidable apparel returns. [hn, 2026-02-21](https://news.ycombinator.com/item?id=47099728)
- Online shoppers distrust virtual try-on because it renders unrealistic fit, so it fails to reduce the guesswork it promises to fix. [hn, 2025-09-30](https://news.ycombinator.com/item?id=45431345)
- Clothing store's size recommender pop-up silently stopped working, so shoppers lost fit guidance and the merchant noticed only later. [other, 2025-01-13](https://apps.shopify.com/kiwi-sizing/reviews?ratings%5B%5D=1&ratings%5B%5D=2&ratings%5B%5D=3&page=2)

**Why now:** Small fashion stores are cutting software spend in 2026, and vision models can now measure a garment from a flat-lay photo to build charts automatically.

pain 3 · frequency 3 · willingness 4 · buildability 4 · learning 3 · novelty 3 · openness 3

</details>

### P143 · Burning clothes because nobody saw demand coming

Apparel makers produce on guesswork, then lose heavily to unsold stock and clearance markdowns, and some destroy wearable excess to protect their prices. Smaller manufacturers cannot even see what is selling, because their inventory reports are too rigid and the mobile views too limited for the factory floor.

**Challenge:** Help a small apparel maker cut next season's unsold stock by a fifth.

Epic · for businesses · global · teaches Data and dashboards, AI agents · also Manufacturing

<details><summary>Evidence (3) and scores (23)</summary>

- Apparel manufacturer finds Zoho Inventory reports too rigid for their needs and the mobile app too limited for floor use. [capterra, 2026-08](https://www.capterra.com/p/146241/Zoho-Inventory/reviews/#2)
- Fashion brands destroy wearable excess inventory to protect pricing rather than discount or donate, wasting stock and drawing criticism. [hn, 2026-07-18](https://news.ycombinator.com/item?id=48959968)
- Traditional garment production overproduces, generating huge annual losses from unsold stock and clearance markdowns for apparel brands. [hn, 2025-03-27](https://news.ycombinator.com/item?id=43493652)

**Why now:** EU rules against destroying unsold textiles are coming into force, and forecasting from messy sales exports is now cheap enough for small makers.

pain 4 · frequency 3 · willingness 3 · buildability 3 · learning 4 · novelty 3 · openness 3

</details>

### P154 · Clothes that look nothing like their photos

Garments bought online often arrive in a different colour, thinner fabric or a worse fit than the listing showed, and price no longer signals quality, so cheap and expensive pieces fall apart alike. Buyers learn the truth only after delivery and then face a slow, contested return.

**Challenge:** Let a shopper judge fabric, colour and build quality before buying, from evidence rather than a seller's photos.

Epic · for consumers · India · teaches Vision, Data and dashboards · also Retail

<details><summary>Evidence (5) and scores (23)</summary>

- Shoppers struggle to find durable clothing made from quality fabric as cheap fast fashion dominates. [hn, 2026-09-15](https://news.ycombinator.com/item?id=49710490)
- Meesho buyer got a poor-quality dress unlike the listing, then waited twenty days with no response to return requests. [other, 2026-08-24](https://www.trustpilot.com/review/meesho.com?page=2#1)
- Meesho products repeatedly differ from listing photos and descriptions, forcing the buyer into returns that support handles with wrong information. [other, 2026-06-18](https://www.trustpilot.com/review/meesho.com?page=5#2)
- Clothing buyers cannot judge durability before purchase because price no longer signals quality; cheap and expensive garments both fall apart. [hn, 2026-05-28](https://news.ycombinator.com/item?id=48312055)
- Clothes bought online often look different in person, with off colours, thinner fabric and poor fit compared to the photos. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#mBXzxdiAF)

**Why now:** Buyer-uploaded photos are now common on every marketplace, and vision models can compare them with listing images at almost no cost.

pain 3 · frequency 4 · willingness 2 · buildability 3 · learning 4 · novelty 3 · openness 4

</details>

### P164 · Garments that shrink and sag after five washes

Mass-market clothes lose shape within a handful of washes and stretch blends shrink even when washed cold, so a correctly sized purchase stops fitting within weeks. Delicate silk and embroidered pieces fare worse at local dry cleaners that use harsh chemicals, and the cost is a constant cycle of replacement.

**Challenge:** Tell a shopper how a garment will survive washing, and how to wash it, before it is ruined.

Legendary · for consumers · global · teaches Vision, Mobile apps

<details><summary>Evidence (3) and scores (23)</summary>

- Mass-market garments lose shape after a handful of wash cycles, forcing frequent replacement and wasted spending. [hn, 2026-03-10](https://news.ycombinator.com/item?id=47329585)
- Silk sarees and embroidered outfits get ruined by local dry cleaners who use harsh chemicals and lack care know-how. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#uojMiY78a)
- Cotton-spandex garments shrink badly even when cold-washed and hang-dried, so a correctly sized purchase stops fitting within weeks. [hn, 2026-01-14](https://news.ycombinator.com/item?id=46625617)

**Why now:** Phone vision can read care labels and fabric close-ups reliably, and fast fashion's falling quality is drawing open complaints in 2026.

pain 3 · frequency 3 · willingness 2 · buildability 4 · learning 3 · novelty 4 · openness 4

</details>

### P174 · Return pickups that never come

Online fashion returns stall at the doorstep: pickups are rescheduled for weeks with false notes that the customer was unavailable, or happen only during working hours when buyers are out. Even after a pickup, refunds sit pending for weeks with no status or escalation route, and some arrive only after a formal consumer complaint.

**Challenge:** Get a stuck return picked up and refunded within a week, without the buyer spending an hour on support.

Epic · for consumers · India · teaches AI agents, Automation and integrations · also Retail

<details><summary>Evidence (6) and scores (23)</summary>

- Return pickup for a damaged item was rescheduled daily for two weeks with false 'customer unavailable' notes; no refund after a month. [other, 2026-09-27](https://www.trustpilot.com/review/nykaa.com#3)
- Myntra shopper raised repeated return requests but pickup was never completed, leaving them stuck with an unwanted garment and no refund path. [other, 2026-09-25](https://www.consumercomplaints.in/myntra-com-failed-to-pick-up-return-c3545040)
- Two dresses returned on Meesho but refund never arrived until the shopper filed a formal consumer complaint. [other, 2026-09-01](https://www.trustpilot.com/review/meesho.com?page=2#3)
- Shopper paid extra for an 'easy return' option on Meesho, yet pickup was postponed for over a month with refund still pending. [other, 2026-06-20](https://www.trustpilot.com/review/meesho.com?page=5#3)
- Return already picked up from the customer, yet the Myntra refund stays pending for weeks with no status visibility or escalation route. [other, 2026-06-06](https://www.consumercomplaints.in/myntra-com-refund-of-money-regarding-return-of-the-product-c3542402)
- Office workers cannot return online orders because courier pickups only happen during working hours when they are out. [fixmyitch, 2026-01-16](https://razorpay.com/m/fix-my-itch/#Zyp2uKaHa)

**Why now:** Agents can now draft and track complaints across support chat, email and India's national consumer helpline, which accepts e-commerce grievances online.

pain 3 · frequency 4 · willingness 2 · buildability 4 · learning 4 · novelty 3 · openness 3

</details>

### P183 · Salons paying commission on their own regulars

Booking software sold to small salons and solo stylists charges marketplace commission on clients who were already theirs, adds per-message and per-card fees, and changes plans without warning. The monthly bill becomes impossible to predict, and some owners give up and go back to a paper diary.

**Challenge:** Let a solo stylist take bookings and deposits from their own clients without paying a cut on every visit.

Rare · for creators · global · teaches Full-stack web, Payments · also Work

<details><summary>Evidence (5) and scores (22)</summary>

- A hair salon paid for SaaS booking software that garbled scheduling and finances, and went back to a paper diary. [hn, 2026-01-27](https://news.ycombinator.com/item?id=46778034)
- Small salon cannot predict monthly booking-software bill; SMS and add-on fees push costs past seventy pounds without warning. [capterra, 2025-11-20](https://www.capterra.com/p/142138/Shedul-com/reviews/?page=2#2)
- Salon owner on Fresha was charged marketplace new-client commission for their own regulars who booked via the in-store QR code. [capterra, 2025-10-12](https://www.capterra.com/p/142138/Shedul-com/reviews/?page=2#1)
- Booking platform abruptly changed pricing, forcing solo beauty professionals into costly team plans or threatening account deletion. [capterra, 2025-10-02](https://www.capterra.com/p/142138/Shedul-com/reviews/?page=2#3)
- Salon is billed hidden per-card verification charges and 20% commission on its own clients, with no formal complaint process to dispute them. [capterra, 2025-03-11](https://www.capterra.com/p/142138/Shedul-com/reviews/?page=2#4)

**Why now:** Several salon booking vendors changed pricing in 2025 and pushed solo professionals onto team plans, while payment links and calendar APIs make a lean alternative cheap to run.

pain 3 · frequency 4 · willingness 4 · buildability 4 · learning 2 · novelty 2 · openness 3

</details>

