import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  FolderPlus, 
  FileText, 
  Tag, 
  Languages, 
  CalendarDays,
  Search,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/context/ProjectContext";

const steps = [
  { id: 1, title: "Project Info", icon: FolderPlus, description: "Project name and description" },
  { id: 2, title: "Category", icon: Tag, description: "Select project category" },
  { id: 3, title: "Keyword", icon: Search, description: "Search keyword" },
  { id: 4, title: "Language", icon: Languages, description: "Tweet language" },
  { id: 5, title: "Date Range", icon: CalendarDays, description: "Time range" },
  { id: 6, title: "Review", icon: FileText, description: "Review project details" },
];

const categories = [
  { value: "politics", label: "Politics", emoji: "🏛️" },
  { value: "business", label: "Business", emoji: "💼" },
  { value: "technology", label: "Technology", emoji: "💻" },
  { value: "sports", label: "Sports", emoji: "⚽" },
  { value: "entertainment", label: "Entertainment", emoji: "🎬" },
  { value: "education", label: "Education", emoji: "📚" },
  { value: "health", label: "Health", emoji: "🏥" },
  { value: "others", label: "Others", emoji: "📌" },
];

const languages = [
  { value: "id", label: "Indonesian", flag: "🇮🇩" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProject } = useProject();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    customCategory: "",
    keyword: "",
    language: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const newProject = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category === "others" ? formData.customCategory : formData.category,
      keywords: [formData.keyword],
      language: formData.language,
      startDate: formData.startDate!,
      endDate: formData.endDate!,
      status: "pending" as const,
      tweetsCount: 0,
      createdAt: new Date(),
    };
    
    addProject(newProject);
    
    toast({
      title: "Project Created! 🎉",
      description: "Project has been created successfully. Scraping will begin shortly.",
    });
    navigate("/projects");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() !== "";
      case 2: return formData.category !== "" && (formData.category !== "others" || formData.customCategory.trim() !== "");
      case 3: return formData.keyword.trim() !== "";
      case 4: return formData.language !== "";
      case 5: return formData.startDate && formData.endDate;
      case 6: return true;
      default: return false;
    }
  };

  const getDisplayCategory = () => {
    if (formData.category === "others") {
      return formData.customCategory || "Custom";
    }
    return categories.find(c => c.value === formData.category)?.label || "-";
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Project</h1>
          <p className="text-muted-foreground">
            Create a new project to analyze tweets from X (Twitter)
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                      backgroundColor: currentStep >= step.id 
                        ? "hsl(203, 89%, 53%)" 
                        : "hsl(222, 30%, 15%)",
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      currentStep > step.id && "bg-success"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className={cn(
                        "w-5 h-5",
                        currentStep >= step.id ? "text-white" : "text-muted-foreground"
                      )} />
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-xs mt-2 hidden lg:block",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-0.5 w-full min-w-[20px] lg:min-w-[60px] mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return StepIcon ? <StepIcon className="w-5 h-5 text-primary" /> : null;
              })()}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Project Name *</Label>
                      {/* UPDATE: Paksa background tetap gelap dengan !bg-muted/50 */}
                      <Input
                        id="name"
                        placeholder="e.g., Persib Bandung Analysis"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2 !bg-muted/50 border-border/50 text-foreground focus:!bg-muted/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your analysis goals..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-2 min-h-[120px] !bg-muted/50 border-border/50 focus:!bg-muted/50"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {categories.map((category) => (
                        <motion.div
                          key={category.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, category: category.value })}
                          className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-all text-center",
                            formData.category === category.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="text-3xl mb-2 block">{category.emoji}</span>
                          <span className="font-medium text-foreground">{category.label}</span>
                        </motion.div>
                      ))}
                    </div>
                    {formData.category === "others" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Label htmlFor="customCategory">Custom Category Name *</Label>
                        <Input
                          id="customCategory"
                          placeholder="Enter your category name..."
                          value={formData.customCategory}
                          onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                          className="mt-2 !bg-muted/50 border-border/50 focus:!bg-muted/50"
                        />
                      </motion.div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="keyword">Search Keyword *</Label>
                      <Input
                        id="keyword"
                        placeholder="Enter a single keyword..."
                        value={formData.keyword}
                        onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                        className="mt-2 !bg-muted/50 border-border/50 focus:!bg-muted/50"
                      />
                    </div>
                    {formData.keyword && (
                      <div className="p-4 rounded-xl bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-2">Your keyword:</p>
                        <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                          {formData.keyword}
                        </Badge>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Tip: Use a specific keyword for more accurate results. Only one keyword per project is allowed.
                    </p>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((lang) => (
                      <motion.div
                        key={lang.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, language: lang.value })}
                        className={cn(
                          "p-6 rounded-xl border-2 cursor-pointer transition-all text-center",
                          formData.language === lang.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-4xl mb-3 block">{lang.flag}</span>
                        <span className="font-medium text-foreground">{lang.label}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal !bg-muted/50 border-border/50",
                              !formData.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => setFormData({ ...formData, startDate: date })}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal !bg-muted/50 border-border/50",
                              !formData.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => setFormData({ ...formData, endDate: date })}
                            disabled={(date) => formData.startDate ? date < formData.startDate : false}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Project Name</Label>
                        <p className="font-medium text-foreground mt-1">{formData.name || "-"}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Category</Label>
                        <p className="font-medium text-foreground mt-1">{getDisplayCategory()}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Language</Label>
                        <p className="font-medium text-foreground mt-1">
                          {languages.find(l => l.value === formData.language)?.label || "-"}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Date Range</Label>
                        <p className="font-medium text-foreground mt-1">
                          {formData.startDate && formData.endDate
                            ? `${format(formData.startDate, "dd MMM")} - ${format(formData.endDate, "dd MMM yyyy")}`
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <Label className="text-muted-foreground text-xs">Keyword</Label>
                      <div className="mt-2">
                        <Badge variant="secondary">{formData.keyword}</Badge>
                      </div>
                    </div>
                    {formData.description && (
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Description</Label>
                        <p className="text-foreground mt-1">{formData.description}</p>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Ready to Create!</p>
                          <p className="text-sm text-muted-foreground">
                            Your project will be created and tweet scraping will begin.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {currentStep === steps.length ? (
                <Button
                  onClick={handleSubmit}
                  className="gradient-primary text-primary-foreground gap-2"
                >
                  Create Project
                  <Check className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="gradient-primary text-primary-foreground gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateProject;