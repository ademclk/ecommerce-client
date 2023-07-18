import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function AdminUploadProductImage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { toast } = useToast();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleFileUpload = async () => {
        if (selectedFiles.length > 0) {
            try {
                const formData = new FormData();
                selectedFiles.forEach((file) => {
                    formData.append(file.name, file);
                });

                setIsUploading(true);
                setShowDialog(false);
                setUploadProgress(50);

                const response = await fetch(`${process.env.baseUrl}Products/Upload`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                    },
                });

                setIsUploading(false);

                if (response.ok) {
                    console.log('File(s) uploaded!');
                    toast({
                        variant: 'default',
                        title: 'Upload Completed',
                        description: 'File(s) uploaded successfully',
                    });

                    // Clear the selected files
                    setSelectedFiles([]);
                } else {
                    console.error('Failed to upload file(s).');
                    toast({
                        variant: 'destructive',
                        title: 'Upload Error',
                        description: 'Failed to upload file(s)',
                    });
                }
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Upload Error',
                    description: 'Failed to upload file(s)',
                });
            }
        }
    };

    const handleDialogOpen = () => {
        setShowDialog(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    return (
        <Card className="w-[300px]">
            <CardHeader>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Picture</Label>
                    <Input id="picture" type="file" accept=".jpg, .png" multiple onChange={handleFileChange} />
                </div>
            </CardHeader>
            <CardContent>
                <Button onClick={handleDialogOpen}>Upload</Button>
                {isUploading && (
                    <div className="mt-2">
                        <Progress value={uploadProgress} className="w-full" />
                        <span className="mt-2">{uploadProgress}%</span>
                    </div>
                )}
            </CardContent>
            <AlertDialog open={showDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Upload Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to upload the selected file(s)?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDialogClose}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleFileUpload}>Upload</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
