import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminUploadProductImage({ cellId }) {
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

                const response = await fetch(`${process.env.baseUrl}Products/Upload/${cellId}`, {
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

    const bytesToKB = (bytes) => {
        const kb = bytes / (1024);
        return kb.toFixed(2);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Picture</Label>
                    <Input id="picture" type="file" accept=".jpg, .png" multiple onChange={handleFileChange} />
                </div>
            </CardHeader>
            <CardContent>
                {selectedFiles.length > 0 && (
                    <>
                        <Button onClick={handleDialogOpen}>Upload</Button>
                        <div className="py-2">
                            <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                                Selected files
                            </h2>
                            <ScrollArea className="h-[100px] w-[400px] px-1">
                                <div className="space-y-1 p-2">
                                    {selectedFiles.map((file, index) => (
                                        <Button
                                            key={`${file.name}-${index}`}
                                            variant="ghost"
                                            className="w-full justify-start font-normal"
                                        >
                                            {file.name} {bytesToKB(file.size)}KB
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </>
                )}
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
