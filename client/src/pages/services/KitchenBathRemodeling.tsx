import ServicePageLayout from "@/components/ServicePageLayout";

export default function KitchenBathRemodeling() {
  return (
    <ServicePageLayout
      eyebrow="Full Kitchen & Bath Remodeling"
      headline="One Team From First Sketch to Final Walkthrough"
      subheadline="Design, cabinetry, countertops, hardware, and installation — managed by the same family business that has served Charlottesville since 1986."
      heroImage="/images/gallery/ubBFg9QkproG.jpg"
      heroImageAlt="Completed full kitchen remodel with white cabinetry, island, and quartz countertops"
      primaryCtaLabel="Book a Design Consultation"
      body={[
        "A full remodel goes wrong when nobody owns the whole thing. The cabinet supplier blames the countertop fabricator, the installer blames the measurements, and the homeowner is left mediating. Critzer's Cabinet Creations handles kitchen and bath remodels as a single scope of work: we design the layout, specify and order the cabinetry, template and install the countertops, source the hardware, and install everything with our own crew. When something needs to be resolved, there is exactly one phone number to call.",
        "It starts with a free consultation, usually in our Berkmar Court showroom, where we talk about how you cook, where the traffic jams happen, and what your realistic budget is. From there we produce measured drawings and 3D renderings so you can see the new layout before anything is ordered. Selections happen with actual samples in hand — door styles, wood species, finishes, countertop material, edge profile, and hardware — and we tell you where spending more genuinely shows and where it does not. As authorized dealers for Omega Cabinetry, Wolf Home Products, Cambria quartz, and Top Knobs hardware, we can build the same design at several price points.",
        "During installation, our crew protects floors and adjacent rooms, sets every cabinet level and plumb, scribes to walls that are never square, and hauls debris out at the end of each day. We coordinate the sequencing of countertop templating, plumbing, and electrical so trades are not stepping on each other. At the end there is a punch walkthrough, adjustment of every door and drawer, and manufacturer warranty registration on your cabinetry and countertops. Forty years in one community means our reputation is the only marketing that actually matters to us.",
      ]}
      bullets={[
        "Free in-showroom design consultation and budget conversation",
        "Measured drawings and 3D renderings before anything is ordered",
        "Cabinetry from Omega, Wolf, and other quality lines at multiple price points",
        "Countertop templating, fabrication, and installation including Cambria quartz",
        "Hardware, lighting, and accessory selection coordinated to the design",
        "Installation by our own craftsmen, with floor protection and daily debris removal",
        "Trade sequencing coordination for plumbing and electrical",
        "Punch walkthrough, final adjustments, and warranty registration",
      ]}
      highlights={[
        {
          title: "Single Point of Accountability",
          description:
            "Design, product, and installation under one roof means no finger-pointing between vendors when a question comes up.",
        },
        {
          title: "See It Before You Buy It",
          description:
            "3D renderings and physical samples mean the finished room looks like what you approved, not a surprise.",
        },
        {
          title: "40 Years, One Community",
          description:
            "We have been in Charlottesville since 1986. Our next job comes from your neighbors, so we do this one right.",
        },
      ]}
      faqs={[
        {
          question: "How long does a full kitchen remodel take?",
          answer:
            "Design and selections usually take two to four weeks, cabinet lead times run four to eight weeks depending on the line and finish, and installation is typically two to three weeks. Countertops are templated after cabinets are set and installed about two weeks later. Most kitchens run ten to sixteen weeks end to end.",
        },
        {
          question: "Will I be without a kitchen the whole time?",
          answer:
            "No. The disruptive window is the installation phase, not the whole project. We can often keep the sink and a working appliance in service for much of it, and we will tell you up front which specific days will be hardest.",
        },
        {
          question: "Can you work with my own contractor or designer?",
          answer:
            "Yes. We regularly supply and install cabinetry and countertops as part of a larger renovation run by a general contractor, and we work from architect or designer drawings when that is how the project is set up.",
        },
        {
          question: "What if I am not ready for a full remodel?",
          answer:
            "Then do not do one. Cabinet refacing, a countertop swap, and new hardware deliver most of the visual impact for a fraction of the cost and time. Our refresh services page lays out those options and rough pricing.",
        },
      ]}
    />
  );
}
