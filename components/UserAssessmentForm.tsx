import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface UserInfo {
  experienceLevel: string;
  techStack: string[];
  currentKnowledge: string;
  learningGoals: string;
}

interface Props {
  onSubmit: (userInfo: UserInfo) => void;
}

const UserAssessmentForm: React.FC<Props> = ({ onSubmit }) => {
  const [techInputValue, setTechInputValue] = React.useState('');
  const [techStack, setTechStack] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState({
    experienceLevel: '',
    currentKnowledge: '',
    learningGoals: ''
  });

  const handleTechAdd = () => {
    if (techInputValue.trim()) {
      setTechStack([...techStack, techInputValue.trim()]);
      setTechInputValue('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      techStack
    });
  };

  return (
    <Card className="max-w-2xl mx-auto p-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-gray-500">This will help us generate relevant questions for your assessment</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies & Tools</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={techInputValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTechAdd();
                  }
                }}
                onChange={(e) => setTechInputValue(e.target.value)}
                placeholder="Add technologies (e.g., React, Node.js)"
              />
              <Button type="button" onClick={handleTechAdd}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">What do you currently know?</label>
            <Textarea
              value={formData.currentKnowledge}
              onChange={(e) => setFormData({ ...formData, currentKnowledge: e.target.value })}
              placeholder="Briefly describe your current knowledge and skills..."
              className="h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">What are your learning goals?</label>
            <Textarea
              value={formData.learningGoals}
              onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
              placeholder="What areas do you want to improve in?"
              className="h-24"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">Start Assessment</Button>
      </CardFooter>
    </Card>
  );
};

export default UserAssessmentForm;
