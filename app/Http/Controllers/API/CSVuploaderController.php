<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Pion\Laravel\ChunkUpload\Exceptions\UploadFailedException;
use Pion\Laravel\ChunkUpload\Exceptions\UploadMissingFileException;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;

class CSVuploaderController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return JsonResponse
     * @throws UploadMissingFileException
     * @throws UploadFailedException
     */
    public function store(Request $request)
    {
        $receiver = new FileReceiver("file", $request, HandlerFactory::classFromRequest($request));

        if($receiver->isUploaded() === false){
            throw new UploadMissingFileException();
        }

        // File receiving phase
        $save = $receiver->receive();

        // Check if the file has been totally uploaded
        if($save->isFinished()) {
            // Save the file and return a response
            return $this->saveFile($save->getFile());
        }

        $handler = $save->handler();
        return response()->json([
           'finished'   => false,
           'percentage' => $handler->getPercentageDone()
        ], 200);
     }

    /**
     *  Function used to store the received file chunk
     *
     * @param UploadedFile $file
     * @return JsonResponse
     */
      protected function saveFile(UploadedFile $file){
          $fileName = $this->createFilename($file);
          $finalPath   = storage_path()."app/public/upload/";

          // move the file
          $file->move($finalPath, $fileName);
          return response()->json([
              'finished' => true,
              'path' => $finalPath.$fileName
          ], 200);
      }

    /**
     * Create unique filename for uploaded file
     *
     * @param UploadedFile $file
     * @return string
     */
    protected function createFilename(UploadedFile $file)
    {
        $today = date("Y-m-d_H:i:s");
        return implode([
            explode(".", $file->getFilename())[0],
            '-',
            $today,
            '.',
            $file->getClientOriginalExtension()
        ]);
    }
}
