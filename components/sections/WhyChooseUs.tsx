import { Card, CardContent } from "@/components/ui/card";
import { Shield, ThumbsUp, Clock } from "lucide-react";

const REASONS = [
  {
    icon: <Shield className="h-12 w-12" />,
    title: "Trusted Dealers",
    description: "All our dealers are verified and trusted partners",
  },
  {
    icon: <ThumbsUp className="h-12 w-12" />,
    title: "Quality Guaranteed",
    description: "Every vehicle undergoes thorough quality checks",
  },
  {
    icon: <Clock className="h-12 w-12" />,
    title: "24/7 Support",
    description: "Our customer support team is always here to help",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REASONS.map((reason) => (
            <Card key={reason.title} className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center text-primary">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}