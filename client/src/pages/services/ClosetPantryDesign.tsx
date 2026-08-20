import ServicePageLayout from "@/components/ServicePageLayout";

export default function ClosetPantryDesign() {
  return (
    <ServicePageLayout
      eyebrow="Closet & Pantry Design"
      headline="Storage Designed Around How You Actually Live"
      subheadline="Custom closets, walk-in pantries, mudroom lockers, and laundry storage — built from the same furniture-grade cabinetry we put in kitchens."
      heroImage="/images/gallery/bt6Vi4lpCf4B.jpg"
      heroImageAlt="Custom built-in cabinetry with drawers and adjustable shelving for organized storage"
      primaryCtaLabel="Start a Storage Design"
      body={[
        "Wire shelving and a single hanging rod waste most of the volume in a closet. Real storage design starts with an inventory: how many long-hanging garments, how many folded, how many pairs of shoes, whether you need a hamper, a safe, a jewelry drawer, or a place for luggage. We measure the space, then draw a plan that uses the full height of the room with double-hang sections, drawer banks, adjustable shelving, and dedicated shoe storage. The result is not just tidier — it usually holds forty to sixty percent more than what it replaced.",
        "Pantries follow the same logic. Deep, dark shelves become inaccessible, so we design with rollout trays, canned-goods risers, appliance garages, and shallower shelf depths that let you see everything at once. In butler's pantries and coffee stations we add stemware storage, cabinet lighting, and a countertop surface that matches or intentionally contrasts with the kitchen. Because these are the same cabinet lines used in our kitchen work, the finishes coordinate exactly and everything carries the same warranty.",
        "The rest of the house benefits too. Mudroom lockers with a bench, hooks, and cubbies stop the pile-up at the back door. Laundry rooms gain folding counters, hamper pullouts, and a place for detergent that is not the floor. Home offices get built-in desks and shelving sized to your equipment. If you have an awkward space under the stairs, in a dormer, or beside a chimney chase, that is exactly the kind of problem custom cabinetry solves and stock furniture cannot.",
      ]}
      bullets={[
        "Primary and reach-in closets with double-hang, drawers, and shoe storage",
        "Walk-in and butler's pantries with rollout trays and appliance garages",
        "Mudroom lockers with benches, hooks, and cubbies",
        "Laundry rooms with folding counters and hamper pullouts",
        "Home office desks, built-in shelving, and file storage",
        "Under-stair, dormer, and other awkward-space solutions",
        "Integrated cabinet lighting and soft-close hardware throughout",
      ]}
      highlights={[
        {
          title: "Measured, Not Guessed",
          description:
            "We measure the space and inventory what has to fit inside it before a single shelf position is drawn.",
        },
        {
          title: "Matches Your Kitchen",
          description:
            "Built from the same cabinet lines and finishes we use in kitchens, so nothing looks like an add-on.",
        },
        {
          title: "Uses the Full Height",
          description:
            "Most closets waste two to three feet of vertical space. Custom design reclaims it without feeling crowded.",
        },
      ]}
      faqs={[
        {
          question: "Is a custom closet worth it compared to a big-box kit?",
          answer:
            "Kits work in simple rectangular closets. Custom design earns its cost when the space has angles, sloped ceilings, or when you need drawers, specific hanging heights, and finishes that match the rest of the house. We will tell you honestly which situation you are in.",
        },
        {
          question: "Can you work with an existing closet without demolition?",
          answer:
            "In most cases yes. We remove the existing wire shelving, patch the anchor points, and install the new system against the existing drywall. Only substantial layout changes require any real construction.",
        },
        {
          question: "How long does a closet or pantry project take?",
          answer:
            "Design and material ordering typically take three to five weeks, and installation is usually one to two days per space. Small pantry retrofits are often completed in a single day.",
        },
      ]}
    />
  );
}
