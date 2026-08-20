import ServicePageLayout from "@/components/ServicePageLayout";

export default function CabinetRefacing() {
  return (
    <ServicePageLayout
      eyebrow="Cabinet Refacing"
      headline="Keep the Boxes. Replace Everything You See."
      subheadline="A brand-new kitchen in three to five days, at a fraction of the cost of full cabinet replacement."
      heroImage="/service-cabinetry.jpg"
      heroImageAlt="Freshly refaced kitchen cabinets with new shaker doors and modern hardware"
      primaryCtaLabel="Get a Refacing Quote"
      body={[
        "Most of the kitchens we see in Charlottesville do not need to be torn out. If the cabinet boxes are solid and the layout already works, cabinet refacing is the smartest money you can spend. We replace every door and drawer front with new ones in the style, wood species, and finish you choose, then cover the exposed face frames and cabinet ends with matching veneer or laminate. When we are finished, the kitchen reads as entirely new cabinetry, because every surface you actually see and touch is new.",
        "Because we are not demolishing boxes, disturbing plumbing, or removing countertops, the disruption is dramatically smaller than a full remodel. A typical refacing project is complete in three to five working days, your sink stays connected, and there is no drywall repair afterward. Homeowners routinely tell us the biggest surprise is how normal life stayed while the work was happening.",
        "Refacing is also the moment to fix everything that has annoyed you for years. While the doors are off, we can add soft-close hinges and full-extension drawer glides, install rollout shelves and lazy susans, convert a dead corner into usable storage, and add crown molding, light rail, or decorative end panels. You end up with the function of new cabinetry and the finish of a custom kitchen, on the budget of a modest renovation.",
      ]}
      bullets={[
        "New doors and drawer fronts in your choice of door style, species, and finish",
        "Matching veneer or laminate applied to face frames and exposed cabinet ends",
        "Soft-close hinge and full-extension glide upgrades",
        "Rollout shelves, lazy susans, and corner storage retrofits",
        "Crown molding, light rail, toe kick, and decorative end panels",
        "New knobs and pulls from over 7,000 Top Knobs options",
      ]}
      highlights={[
        {
          title: "Days, Not Months",
          description:
            "Most refacing projects wrap up in three to five working days, with your kitchen usable in the evenings.",
        },
        {
          title: "A Fraction of Replacement Cost",
          description:
            "Refacing typically runs a fraction of new cabinetry for the same kitchen because the boxes and countertops stay in place.",
        },
        {
          title: "Showroom Samples in Hand",
          description:
            "Come see and feel actual door samples and finishes at our Berkmar Court showroom before you commit to anything.",
        },
      ]}
      faqs={[
        {
          question: "How do I know if my cabinets are good candidates for refacing?",
          answer:
            "If the boxes are structurally sound, are not swollen from water damage, and the layout works for how you cook, they are almost certainly a good candidate. We will come out, look at the boxes and hinges, and tell you honestly if refacing is the right call or if replacement makes more sense.",
        },
        {
          question: "Can you match a color I already have elsewhere in the house?",
          answer:
            "Yes. Between our cabinet lines and finish options we can match or closely coordinate with existing trim, flooring, and adjacent built-ins. Bring a sample or a photo to the showroom and we will work from it.",
        },
        {
          question: "Do I have to empty my cabinets?",
          answer:
            "We ask that you clear the lower shelves and anything sitting directly behind the doors. The interiors of the boxes stay in place, so most of your dishes and pantry items can remain where they are.",
        },
      ]}
    />
  );
}
