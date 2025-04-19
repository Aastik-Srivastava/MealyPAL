import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useExcelUpload } from '@/hooks/useExcelUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

export function Upload() {
  const { user } = useAuth()
  const { processExcelFile, loading } = useExcelUpload()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile)
    } else {
      toast.error('Please select a valid Excel file (.xlsx)')
    }
  }

  const handleUpload = async () => {
    if (!file || !user?.id) return

    try {
      const { error } = await processExcelFile(file, user.id)
      if (error) throw new Error(error)

      toast.success('Meal plan uploaded successfully')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Failed to upload meal plan')
      console.error('Error uploading meal plan:', err)
    }
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Weekly Meal Plan</CardTitle>
          <CardDescription>
            Upload your Excel file containing your weekly meal plan. The file should include meals,
            food items, and their macros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Only .xlsx files are supported
              </p>
            </div>
            {file && (
              <div className="flex items-center gap-4">
                <Button onClick={handleUpload} disabled={loading}>
                  {loading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setFile(null)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Excel File Format</h3>
              <p className="text-sm text-muted-foreground">
                Your Excel file should have the following columns:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>date (YYYY-MM-DD)</li>
                <li>type (breakfast, lunch, evening_snacks, dinner)</li>
                <li>name (meal name)</li>
                <li>food_name</li>
                <li>calories (number)</li>
                <li>protein (number in grams)</li>
                <li>carbs (number in grams)</li>
                <li>fats (number in grams)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 