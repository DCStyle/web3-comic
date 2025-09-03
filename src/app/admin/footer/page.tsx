"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  ExternalLink,
  Settings,
  Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface CompanyLink {
  name: string;
  url: string;
}

interface FooterData {
  id?: string;
  companyName: string;
  companyTagline: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterEnabled: boolean;
  socialLinks: SocialLink[];
  companyLinks: CompanyLink[];
  socialsTitle: string;
  copyrightText: string;
  showBuiltWith: boolean;
  builtWithText: string;
  isActive: boolean;
}

const socialIcons = [
  "twitter", "facebook", "instagram", "linkedin", 
  "youtube", "github", "dribbble", "behance"
];

export default function FooterAdminPage() {
  const { data: session, status } = useSession();
  const [footerData, setFooterData] = useState<FooterData>({
    companyName: "",
    companyTagline: "",
    newsletterTitle: "",
    newsletterSubtitle: "",
    newsletterEnabled: true,
    socialLinks: [],
    companyLinks: [],
    socialsTitle: "",
    copyrightText: "",
    showBuiltWith: true,
    builtWithText: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      redirect("/admin");
    }
    
    fetchFooterData();
  }, [session, status]);

  const fetchFooterData = async () => {
    try {
      const response = await fetch("/api/admin/footer");
      if (response.ok) {
        const data = await response.json();
        setFooterData(data);
      }
    } catch (error) {
      console.error("Failed to fetch footer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footerData),
      });

      if (response.ok) {
        alert("Footer settings saved successfully!");
      } else {
        alert("Failed to save footer settings");
      }
    } catch (error) {
      console.error("Error saving footer data:", error);
      alert("Failed to save footer settings");
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setFooterData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: "", url: "", icon: "twitter" }]
    }));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setFooterData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSocialLink = (index: number) => {
    setFooterData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const addCompanyLink = () => {
    setFooterData(prev => ({
      ...prev,
      companyLinks: [...prev.companyLinks, { name: "", url: "" }]
    }));
  };

  const updateCompanyLink = (index: number, field: keyof CompanyLink, value: string) => {
    setFooterData(prev => ({
      ...prev,
      companyLinks: prev.companyLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeCompanyLink = (index: number) => {
    setFooterData(prev => ({
      ...prev,
      companyLinks: prev.companyLinks.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Footer Management</h1>
          <p className="text-muted-foreground">
            Customize your website footer settings and content
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setPreview(!preview)}
            icon={preview ? <EyeOff /> : <Eye />}
          >
            {preview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            icon={saving ? <Loader2 className="animate-spin" /> : <Save />}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic footer configuration and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Footer Active</Label>
                  <div className="text-sm text-muted-foreground">
                    Show/hide footer across the site
                  </div>
                </div>
                <Switch
                  checked={footerData.isActive}
                  onCheckedChange={(checked) => 
                    setFooterData(prev => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={footerData.companyName}
                  onChange={(e) => 
                    setFooterData(prev => ({ ...prev, companyName: e.target.value }))
                  }
                  placeholder="Your Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyTagline">Company Tagline</Label>
                <Textarea
                  id="companyTagline"
                  value={footerData.companyTagline}
                  onChange={(e) => 
                    setFooterData(prev => ({ ...prev, companyTagline: e.target.value }))
                  }
                  placeholder="Your company tagline or description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter Enabled</Label>
                  <div className="text-sm text-muted-foreground">
                    Show newsletter signup form
                  </div>
                </div>
                <Switch
                  checked={footerData.newsletterEnabled}
                  onCheckedChange={(checked) => 
                    setFooterData(prev => ({ ...prev, newsletterEnabled: checked }))
                  }
                />
              </div>
              {footerData.newsletterEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newsletterTitle">Newsletter Title</Label>
                    <Input
                      id="newsletterTitle"
                      value={footerData.newsletterTitle}
                      onChange={(e) => 
                        setFooterData(prev => ({ ...prev, newsletterTitle: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newsletterSubtitle">Newsletter Subtitle</Label>
                    <Textarea
                      id="newsletterSubtitle"
                      value={footerData.newsletterSubtitle}
                      onChange={(e) => 
                        setFooterData(prev => ({ ...prev, newsletterSubtitle: e.target.value }))
                      }
                      rows={2}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Company Links */}
          <Card>
            <CardHeader>
              <CardTitle>Company Links</CardTitle>
              <CardDescription>
                Links displayed in the company section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerData.companyLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Link Name"
                    value={link.name}
                    onChange={(e) => updateCompanyLink(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateCompanyLink(index, "url", e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCompanyLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addCompanyLink}
                className="w-full"
                icon={<Plus />}
              >
                Add Company Link
              </Button>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Social media links and profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="socialsTitle">Social Section Title</Label>
                <Input
                  id="socialsTitle"
                  value={footerData.socialsTitle}
                  onChange={(e) => 
                    setFooterData(prev => ({ ...prev, socialsTitle: e.target.value }))
                  }
                />
              </div>
              {footerData.socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Platform Name"
                    value={link.name}
                    onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                  />
                  <select
                    value={link.icon}
                    onChange={(e) => updateSocialLink(index, "icon", e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    {socialIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSocialLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addSocialLink}
                className="w-full"
                icon={<Plus />}
              >
                Add Social Link
              </Button>
            </CardContent>
          </Card>

          {/* Copyright Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Copyright & Attribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="copyrightText">Copyright Text</Label>
                <Input
                  id="copyrightText"
                  value={footerData.copyrightText}
                  onChange={(e) => 
                    setFooterData(prev => ({ ...prev, copyrightText: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show &quot;Built With&quot; Attribution</Label>
                  <div className="text-sm text-muted-foreground">
                    Display technology attribution
                  </div>
                </div>
                <Switch
                  checked={footerData.showBuiltWith}
                  onCheckedChange={(checked) => 
                    setFooterData(prev => ({ ...prev, showBuiltWith: checked }))
                  }
                />
              </div>
              {footerData.showBuiltWith && (
                <div className="space-y-2">
                  <Label htmlFor="builtWithText">Built With Text</Label>
                  <Input
                    id="builtWithText"
                    value={footerData.builtWithText}
                    onChange={(e) => 
                      setFooterData(prev => ({ ...prev, builtWithText: e.target.value }))
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        {preview && (
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  Preview how your footer will appear on the site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-white/10 rounded-lg p-6 text-gray-800 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Company Info */}
                    <div className="md:col-span-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <span className="font-bold">{footerData.companyName}</span>
                      </div>
                      <p className="text-gray-300 text-xs mb-4">
                        {footerData.companyTagline}
                      </p>
                    </div>

                    {/* Company Links */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-3">Company</h4>
                      <ul className="space-y-2">
                        {footerData.companyLinks.map((link, i) => (
                          <li key={i} className="text-gray-300 text-xs flex items-center gap-1">
                            {link.name} <ExternalLink className="h-2 w-2" />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Social Links */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-3">{footerData.socialsTitle}</h4>
                      <ul className="space-y-2">
                        {footerData.socialLinks.map((link, i) => (
                          <li key={i} className="text-gray-300 text-xs flex items-center gap-1">
                            {link.name} <ExternalLink className="h-2 w-2" />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Newsletter */}
                    {footerData.newsletterEnabled && (
                      <div className="md:col-span-3">
                        <h4 className="font-semibold mb-1">{footerData.newsletterTitle}</h4>
                        <p className="text-gray-300 text-xs mb-3">
                          {footerData.newsletterSubtitle}
                        </p>
                        <div className="space-y-2">
                          <input 
                            type="email" 
                            placeholder="Enter your email..." 
                            className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs"
                            disabled
                          />
                          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-2 py-1 text-xs">
                            Subscribe
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-6 border-t border-white/10">
                    <p className="text-gray-400 text-xs">
                      {footerData.copyrightText}
                    </p>
                    {footerData.showBuiltWith && (
                      <div className="flex items-center gap-1 mt-2 sm:mt-0">
                        <span className="text-gray-400 text-xs">{footerData.builtWithText}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <Badge variant={footerData.isActive ? "default" : "secondary"}>
                    {footerData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}