import { Button } from '@/components/shared/ui/button';
import { LandingPrimaryImageCtaSection } from '@/components/landing/cta/LandingPrimaryCta';
import { LandingBandSection } from '@/components/landing/LandingBand';
import { LandingFeatureList } from '@/components/landing/feature/LandingFeatureList';
import { LandingProductFeaturesGrid } from '@/components/landing/LandingProductFeaturesGrid';
import { LandingProductCardSection } from '@/components/landing/card/LandingProductCardSection';
import { LandingProductFeature } from '@/components/landing/LandingProductFeature';
import { LandingTestimonialGrid } from '@/components/landing/testimonial/LandingTestimonialGrid';
import { LandingSocialProof } from '@/components/landing/social-proof/LandingSocialProof';
import { LandingShowcase } from '@/components/landing/showcase/LandingShowcase';
import { LandingShowcaseItem } from '@/components/landing/showcase/LandingShowcaseItem';
import { LandingProductSteps } from '@/components/landing/LandingProductSteps';
import { LandingSaleCtaSection } from '@/components/landing/cta/LandingSaleCta';
import { LandingFaqSection } from '@/components/landing/LandingFaq';
import { LandingFooter } from '@/components/landing/footer/LandingFooter';
import { LandingFooterColumn } from '@/components/landing/footer/LandingFooterColumn';
import { LandingFooterLink } from '@/components/landing/footer/LandingFooterLink';
import { LandingHeader } from '@/components/landing/navigation/LandingHeader';
import { LandingHeaderMenuItem } from '@/components/landing/navigation/LandingHeaderMenuItem';
import { LandingLeadingPill } from '@/components/landing/leading/LandingLeadingPill';
import { LandingProductFeatureKeyPoints } from '@/components/landing/LandingProductFeatureKeyPoints';

import {
  CodeIcon, 
  SparklesIcon, 
  LayersIcon, 
  PaletteIcon, 
  BrainCircuitIcon,
  WandIcon,
  GitBranchIcon,
  EditIcon,
  PlayIcon,
  ChromeIcon,
  DatabaseIcon,
  CpuIcon,
  ZapIcon,
  RocketIcon
} from 'lucide-react';

export default function Home() {
  const featureItems = [
    {
      title: 'Tech Stack Customization',
      description: 'Customize Codegens based on specific technology frameworks like React, Vue, HTML and more.',
      icon: <CodeIcon className="w-6 h-6" />,
    },
    {
      title: 'Component Library Support',
      description: 'Support for any open-source & private component libraries like Mui, Antd, Element-Plus, Shadcn UI.',
      icon: <LayersIcon className="w-6 h-6" />,
    },
    {
      title: 'Scenario Customization',
      description: 'Customize for specific scenarios like Landing Pages, Email Templates, Admin Systems, APP Prototypes.',
      icon: <PaletteIcon className="w-6 h-6" />,
    },
    {
      title: 'Code Specification',
      description: 'Customize based on specific code specifications including file structure and styling approaches.',
      icon: <SparklesIcon className="w-6 h-6" />,
    },
    {
      title: 'AI Model Integration',
      description: 'Support for various AI models including OpenAI, Claude, and other cutting-edge models.',
      icon: <BrainCircuitIcon className="w-6 h-6" />,
    },
  ];

  const testimonialItems = [
    {
      name: 'Sarah Chen',
      text: 'Compoder has revolutionized our development workflow. We can generate production-ready components in minutes instead of hours.',
      handle: '@sarahdev',
      imageSrc: 'https://picsum.photos/100/100.webp?random=1',
      featured: true,
    },
    {
      name: 'Alex Rodriguez',
      text: 'The customization options are incredible. Being able to adapt it to our internal component library saved us weeks of work.',
      handle: '@alexcode',
      imageSrc: 'https://picsum.photos/100/100.webp?random=2',
    },
    {
      name: 'David Kim',
      text: 'Perfect for rapid prototyping. The AI understands context and generates exactly what we need.',
      handle: '@davidkim',
      imageSrc: 'https://picsum.photos/100/100.webp?random=3',
      featured: true,
    },
    {
      name: 'Maria Santos',
      text: 'Code version iteration feature is a game-changer. We can experiment with different approaches effortlessly.',
      handle: '@mariasantos',
      imageSrc: 'https://picsum.photos/100/100.webp?random=4',
    },
    {
      name: 'James Wilson',
      text: 'The real-time preview makes development so much more efficient. No more context switching.',
      handle: '@jameswilson',
      imageSrc: 'https://picsum.photos/100/100.webp?random=5',
    },
    {
      name: 'Emily Zhang',
      text: 'Excellent tool for teams. The consistency in generated code quality is outstanding.',
      handle: '@emilyzhang',
      imageSrc: 'https://picsum.photos/100/100.webp?random=6',
      featured: true,
    },
  ];

  const avatarItems = [
    { imageSrc: 'https://picsum.photos/100/100.webp?random=7', name: 'John Doe' },
    { imageSrc: 'https://picsum.photos/100/100.webp?random=8', name: 'Jane Smith' },
    { imageSrc: 'https://picsum.photos/100/100.webp?random=9', name: 'Mike Johnson' },
    { imageSrc: 'https://picsum.photos/100/100.webp?random=10', name: 'Lisa Brown' },
    { imageSrc: 'https://picsum.photos/100/100.webp?random=11', name: 'Tom Wilson' },
  ];

  const faqItems = [
    {
      question: 'What makes Compoder different from other code generators?',
      answer: 'Compoder is fully customizable for any tech stack, component library, and specific use case. It\'s not just a template generator - it\'s an intelligent system that understands your requirements and coding standards.',
    },
    {
      question: 'Can I use Compoder with my existing component library?',
      answer: 'Absolutely! Compoder supports both open-source libraries like Mui, Antd, Shadcn UI and your private component libraries. You can train it on your specific components and coding patterns.',
    },
    {
      question: 'How does the AI model customization work?',
      answer: 'You can configure Compoder to work with different AI models including OpenAI GPT, Claude, and others. Each model can be fine-tuned for your specific requirements and coding style.',
    },
    {
      question: 'Is the generated code production-ready?',
      answer: 'Yes! Compoder generates clean, maintainable code that follows best practices. The real-time preview and iteration features ensure quality before you use the code in production.',
    },
    {
      question: 'Can I modify the generated code?',
      answer: 'Definitely! Compoder includes an integrated code editor for fine-tuning. You can also iterate on any version of generated code to create new variations.',
    },
    {
      question: 'What scenarios does Compoder support?',
      answer: 'Compoder can be customized for landing pages, email templates, admin dashboards, app prototypes, data cards, promotional materials, and virtually any UI component scenario.',
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <LandingProductCardSection
        title="Explore Our Features"
        description="Discover the powerful features of Compoder"
        gridColumns={3}
        variant="primary"
        withBackground
        products={[
          {
            title: "Customizable Codegen",
            description: "Create component code generators for any tech stack.",
            imageSrc: "/static/images/backdrop-1.webp",
            actionComponent: <Button>Learn More</Button>
          },
          {
            title: "Real-time Preview",
            description: "Instantly see your code changes in action.",
            imageSrc: "/static/images/backdrop-2.webp",
            actionComponent: <Button>Explore</Button>
          },
          {
            title: "Open Source",
            description: "Contribute and customize with our open-source platform.",
            imageSrc: "/static/images/backdrop-3.webp",
            actionComponent: <Button>Contribute</Button>
          }
        ]}
      />
      <LandingHeader
        logoComponent={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CodeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Compoder</span>
          </div>
        }
        className='justify-self-center w-'
      >
        <LandingHeaderMenuItem href="#features" label="Features" />
        <LandingHeaderMenuItem href="#how-it-works" label="How it Works" />
        <LandingHeaderMenuItem href="#testimonials" label="Testimonials" />
        <LandingHeaderMenuItem href="#faq" label="FAQ" />
        <Button size="sm" asChild>
          <a href="#get-started">Get Started</a>
        </Button>
      </LandingHeader>

      {/* Hero Section */}
      <LandingPrimaryImageCtaSection
        title="AI-Powered Component Code Generation Engine"
        descriptionComponent={
          <LandingProductFeatureKeyPoints
            keyPoints={[
              {
                title: 'Customizable Codegens',
                description: 'Freely customize component code generators based on various tech stacks, libraries, and scenarios.',
              },
              {
                title: 'Multi-Model Support',
                description: 'Integrate with OpenAI, Claude, and other cutting-edge AI models for optimal results.',
              },
              {
                title: 'Real-time Development',
                description: 'Built-in preview sandbox with second-level rendering and integrated code editor.',
              },
            ]}
          />
        }
        imageSrc="https://picsum.photos/800/600.webp?random=hero"
        imageAlt="Compoder Dashboard"
        withBackground
        withBackgroundGlow
        leadingComponent={
          <LandingLeadingPill
            text="🔥 Open Source"
            borderVariant="primary"
          />
        }
      >
        <Button size="xl" asChild>
          <a href="#get-started">Start Building Now</a>
        </Button>

        <Button size="xl" variant="outlinePrimary">
          <a href="#demo">View Demo</a>
        </Button>

        <LandingSocialProof
          className="w-full mt-12"
          showRating
          numberOfUsers={5000}
          suffixText="developers trust Compoder"
          avatarItems={avatarItems}
        />
      </LandingPrimaryImageCtaSection>

      {/* Social Proof Band */}
      <LandingBandSection
        title="5000+"
        description="Components generated daily by developers worldwide"
        supportingComponent={
          <div className="flex items-center space-x-8 opacity-60">
            <LayersIcon className="w-12 h-12" />
            <ChromeIcon className="w-12 h-12" />
            <DatabaseIcon className="w-12 h-12" />
            <CpuIcon className="w-12 h-12" />
          </div>
        }
      />

      {/* Core Features */}
      <section id="features">
        <LandingFeatureList
          title="🔥 Core Features"
          description="Compoder integrates modern frontend tech stacks with various AI model capabilities. Customize every aspect of your component generation workflow."
          featureItems={featureItems}
          withBackground
          variant="secondary"
        />
      </section>

      {/* Basic Functions Grid */}
      <LandingProductFeaturesGrid
        title="🌟 Basic Functions"
        description="Everything you need for efficient component development workflow"
        numberOfColumns={2}
      >
        <LandingProductFeature
          title="Prompt (Text, Image) To Code"
          description="Input text descriptions or upload images to generate component code. Our AI understands your requirements and creates production-ready components."
          imageSrc="https://picsum.photos/600/400.webp?random=prompt"
          imageAlt="Prompt to Code"
          imagePerspective="paper"
          leadingComponent={
            <LandingLeadingPill
              leftComponent={<WandIcon className="w-4 h-4" />}
              withBackground
              backgroundVariant="primary"
            >
              AI Powered
            </LandingLeadingPill>
          }
        />

        <LandingProductFeature
          title="Code Version Iteration"
          description="Support code version iteration, view historical versions, and generate new code based on any previous version for continuous improvement."
          imageSrc="https://picsum.photos/600/400.webp?random=version"
          imageAlt="Code Version Iteration"
          imagePerspective="paper"
          leadingComponent={
            <LandingLeadingPill
              leftComponent={<GitBranchIcon className="w-4 h-4" />}
              withBackground
              backgroundVariant="primary"
            >
              Version Control
            </LandingLeadingPill>
          }
        />

        <LandingProductFeature
          title="Online Code Fine-tuning"
          description="Integrated code editor for intuitive code adjustment and saving. Make changes in real-time and see results instantly."
          imageSrc="https://picsum.photos/600/400.webp?random=editor"
          imageAlt="Code Editor"
          imagePerspective="paper"
          leadingComponent={
            <LandingLeadingPill
              leftComponent={<EditIcon className="w-4 h-4" />}
              withBackground
              backgroundVariant="primary"
            >
              Live Editing
            </LandingLeadingPill>
          }
        />

        <LandingProductFeature
          title="Real-time Code Preview"
          description="Built-in preview sandbox environment supporting various tech stacks with second-level rendering. See your components come to life instantly."
          imageSrc="https://picsum.photos/600/400.webp?random=preview"
          imageAlt="Real-time Preview"
          imagePerspective="paper"
          leadingComponent={
            <LandingLeadingPill
              leftComponent={<PlayIcon className="w-4 h-4" />}
              withBackground
              backgroundVariant="primary"
            >
              Live Preview
            </LandingLeadingPill>
          }
        />
      </LandingProductFeaturesGrid>

      {/* Tech Stack Showcase */}
      <LandingShowcase
        title="Supporting All Major Tech Stacks"
        description="Compoder supports React, Vue, HTML, and various component libraries including Mui, Antd, Element-Plus, Tailwind CSS, Shadcn UI, and your private component libraries."
        withBackground
        variant="primary"
      >
        <LandingShowcaseItem>
          <div className="flex flex-col items-center space-y-2">
            <LayersIcon className="w-10 h-10" />
            <span className="text-sm font-medium">React</span>
          </div>
        </LandingShowcaseItem>
        <LandingShowcaseItem>
          <div className="flex flex-col items-center space-y-2">
            <LayersIcon className="w-10 h-10" />
            <span className="text-sm font-medium">Vue</span>
          </div>
        </LandingShowcaseItem>
        <LandingShowcaseItem>
          <div className="flex flex-col items-center space-y-2">
            <CodeIcon className="w-10 h-10" />
            <span className="text-sm font-medium">HTML</span>
          </div>
        </LandingShowcaseItem>
        <LandingShowcaseItem>
          <div className="flex flex-col items-center space-y-2">
            <PaletteIcon className="w-10 h-10" />
            <span className="text-sm font-medium">Tailwind</span>
          </div>
        </LandingShowcaseItem>
        <LandingShowcaseItem>
          <div className="flex flex-col items-center space-y-2">
            <SparklesIcon className="w-10 h-10" />
            <span className="text-sm font-medium">Shadcn UI</span>
          </div>
        </LandingShowcaseItem>
        <LandingShowcaseItem>
          <div className="flex flex-col items-center space-y-2">
            <DatabaseIcon className="w-10 h-10" />
            <span className="text-sm font-medium">Mui</span>
          </div>
        </LandingShowcaseItem>
        <LandingShowcaseItem>
          <div className="flex flex-col items-center space-y-2">
            <CpuIcon className="w-10 h-10" />
            <span className="text-sm font-medium">Antd</span>
          </div>
        </LandingShowcaseItem>
        <LandingShowcaseItem>
          <div className="flex flex-col items-center space-y-2">
            <ZapIcon className="w-10 h-10" />
            <span className="text-sm font-medium">Element-Plus</span>
          </div>
        </LandingShowcaseItem>
      </LandingShowcase>

      {/* How it Works */}
      <section id="how-it-works">
        <LandingProductSteps
          title="How Compoder Works"
          description="Experience the power of AI-driven component generation with our intuitive workflow"
          withBackground
          variant="secondary"
        >
          <LandingProductFeature
            title="1. Choose Your Tech Stack"
            description="Select your preferred framework, component library, and configure your coding standards for optimal code generation."
            imageSrc="https://picsum.photos/600/400.webp?random=step1"
            imageAlt="Choose Tech Stack"
          />

          <LandingProductFeature
            title="2. Describe Your Component"
            description="Use text prompts or upload images to describe the component you want to generate. Our AI understands your requirements."
            imageSrc="https://picsum.photos/600/400.webp?random=step2"
            imageAlt="Describe Component"
          />

          <LandingProductFeature
            title="3. Generate & Iterate"
            description="AI generates your component code. Refine and iterate until it's perfect with our integrated editor and preview."
            imageSrc="https://picsum.photos/600/400.webp?random=step3"
            imageAlt="Generate & Iterate"
          />

          <LandingProductFeature
            title="4. Preview & Export"
            description="See real-time preview, make final adjustments, and export production-ready code that follows best practices."
            imageSrc="https://picsum.photos/600/400.webp?random=step4"
            imageAlt="Preview & Export"
          />
        </LandingProductSteps>
      </section>

      {/* Development Process */}
      <LandingProductSteps
        title="Streamlined Development Process"
        description="From concept to production-ready code in minutes, not hours"
        withBackgroundGlow
      >
        <LandingProductFeature
          title="Define Requirements"
          description="Specify your tech stack, component library, coding standards, and AI model preferences for optimal code generation."
          imageSrc="https://picsum.photos/600/400.webp?random=requirements"
          imageAlt="Define Requirements"
        />

        <LandingProductFeature
          title="AI Code Generation"
          description="Advanced AI models analyze your requirements and generate clean, maintainable component code following best practices."
          imageSrc="https://picsum.photos/600/400.webp?random=generation"
          imageAlt="AI Code Generation"
        />

        <LandingProductFeature
          title="Real-time Refinement"
          description="Use the integrated editor and live preview to fine-tune your components. Iterate quickly until you achieve the perfect result."
          imageSrc="https://picsum.photos/600/400.webp?random=refinement"
          imageAlt="Real-time Refinement"
        />
      </LandingProductSteps>

      {/* Testimonials */}
      <section id="testimonials">
        <LandingTestimonialGrid
          title="Loved by Developers Worldwide"
          description="See what developers are saying about their experience with Compoder"
          testimonialItems={testimonialItems}
          withBackground
          variant="primary"
        />
      </section>

      {/* CTA Section */}
      <section id="get-started">
        <LandingSaleCtaSection
          title="Ready to Transform Your Development Workflow?"
          description="Join thousands of developers who are already using Compoder to build better components faster. Start generating production-ready code today."
          ctaHref="#"
          ctaLabel="Start Free Trial"
          secondaryCtaHref="#"
          secondaryCtaLabel="View Documentation"
          withBackground
          variant="secondary"
        />
      </section>

      {/* FAQ */}
      <section id="faq">
        <LandingFaqSection
          title="Frequently Asked Questions"
          description="Everything you need to know about Compoder and how it can accelerate your development workflow."
          faqItems={faqItems}
          withBackground
          variant="primary"
        />
      </section>

      {/* Footer */}
      <LandingFooter
        logoComponent={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CodeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Compoder</span>
          </div>
        }
        description="Open-source AI-powered component code generation engine for modern developers."
      >
        <LandingFooterColumn title="Product">
          <LandingFooterLink href="#features">Features</LandingFooterLink>
          <LandingFooterLink href="#how-it-works">How it Works</LandingFooterLink>
          <LandingFooterLink href="#pricing">Pricing</LandingFooterLink>
          <LandingFooterLink href="#docs">Documentation</LandingFooterLink>
        </LandingFooterColumn>

        <LandingFooterColumn title="Resources">
          <LandingFooterLink href="#">GitHub</LandingFooterLink>
          <LandingFooterLink href="#">Examples</LandingFooterLink>
          <LandingFooterLink href="#">Blog</LandingFooterLink>
          <LandingFooterLink href="#">Community</LandingFooterLink>
        </LandingFooterColumn>

        <LandingFooterColumn title="Support">
          <LandingFooterLink href="#faq">FAQ</LandingFooterLink>
          <LandingFooterLink href="#">Contact</LandingFooterLink>
          <LandingFooterLink href="#">Discord</LandingFooterLink>
          <LandingFooterLink href="#">Help Center</LandingFooterLink>
        </LandingFooterColumn>
      </LandingFooter>
    </div>
  );
}
