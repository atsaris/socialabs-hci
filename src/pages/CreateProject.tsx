import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Project Info", icon: FolderPlus, description: "Nama dan deskripsi project" },
  { id: 2, title: "Category", icon: Tag, description: "Pilih kategori project" },
  { id: 3, title: "Keywords", icon: Search, description: "Kata kunci pencarian" },
  { id: 4, title: "Language", icon: Languages, description: "Bahasa tweet" },
  { id: 5, title: "Date Range", icon: CalendarDays, description: "Rentang waktu" },
  { id: 6, title: "Review", icon: FileText, description: "Tinjau ulang project" },
];

const categories = [
  { value: "politik", label: "Politik", emoji: "🏛️" },
  { value: "bisnis", label: "Bisnis", emoji: "💼" },
  { value: "teknologi", label: "Teknologi", emoji: "💻" },
  { value: "olahraga", label: "Olahraga", emoji: "⚽" },
  { value: "hiburan", label: "Hiburan", emoji: "🎬" },
  { value: "pendidikan", label: "Pendidikan", emoji: "📚" },
  { value: "kesehatan", label: "Kesehatan", emoji: "🏥" },
  { value: "lainnya", label: "Lainnya", emoji: "📌" },
];

const languages = [
  { value: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "all", label: "Semua Bahasa", flag: "🌐" },
];

const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    keywords: [] as string[],
    keywordInput: "",
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

  const addKeyword = () => {
    if (formData.keywordInput.trim() && !formData.keywords.includes(formData.keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, formData.keywordInput.trim()],
        keywordInput: "",
      });
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keyword),
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Project Created! 🎉",
      description: "Project berhasil dibuat. Proses scraping akan dimulai.",
    });
    navigate("/");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() !== "";
      case 2: return formData.category !== "";
      case 3: return formData.keywords.length > 0;
      case 4: return formData.language !== "";
      case 5: return formData.startDate && formData.endDate;
      case 6: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Project</h1>
          <p className="text-muted-foreground">
            Buat project baru untuk menganalisis tweet dari X (Twitter)
          </p>
        </div>

        {/* Progress Steps */}
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

        {/* Form Card */}
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
                {/* Step 1: Project Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Project *</Label>
                      <Input
                        id="name"
                        placeholder="Contoh: Analisis Pemilu 2024"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Deskripsi (Opsional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Jelaskan tujuan analisis Anda..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Category */}
                {currentStep === 2 && (
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
                )}

                {/* Step 3: Keywords */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Masukkan kata kunci..."
                        value={formData.keywordInput}
                        onChange={(e) => setFormData({ ...formData, keywordInput: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                      />
                      <Button onClick={addKeyword} variant="secondary">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[100px] p-4 rounded-xl bg-muted/50">
                      {formData.keywords.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          Belum ada kata kunci. Tambahkan minimal satu kata kunci.
                        </p>
                      ) : (
                        formData.keywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm cursor-pointer hover:bg-destructive/10"
                            onClick={() => removeKeyword(keyword)}
                          >
                            {keyword}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tips: Gunakan kata kunci yang spesifik untuk hasil yang lebih akurat.
                    </p>
                  </div>
                )}

                {/* Step 4: Language */}
                {currentStep === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Step 5: Date Range */}
                {currentStep === 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Tanggal Mulai *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {formData.startDate ? format(formData.startDate, "PPP") : "Pilih tanggal"}
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
                      <Label>Tanggal Akhir *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {formData.endDate ? format(formData.endDate, "PPP") : "Pilih tanggal"}
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

                {/* Step 6: Review */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Nama Project</Label>
                        <p className="font-medium text-foreground mt-1">{formData.name || "-"}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Kategori</Label>
                        <p className="font-medium text-foreground mt-1">
                          {categories.find(c => c.value === formData.category)?.label || "-"}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Bahasa</Label>
                        <p className="font-medium text-foreground mt-1">
                          {languages.find(l => l.value === formData.language)?.label || "-"}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Rentang Waktu</Label>
                        <p className="font-medium text-foreground mt-1">
                          {formData.startDate && formData.endDate
                            ? `${format(formData.startDate, "dd MMM")} - ${format(formData.endDate, "dd MMM yyyy")}`
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <Label className="text-muted-foreground text-xs">Kata Kunci</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                    {formData.description && (
                      <div className="p-4 rounded-xl bg-muted/50">
                        <Label className="text-muted-foreground text-xs">Deskripsi</Label>
                        <p className="text-foreground mt-1">{formData.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="gradient-primary text-primary-foreground"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="gradient-primary text-primary-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Buat Project
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
