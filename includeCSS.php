<?php
    
    function searchForCSS($directory){
        
        foreach (new DirectoryIterator($directory) as $file){

            $relpath = $directory.'/'.$file->getFilename();
            
            // file is css
            if( str_ends_with($file->getFilename(), '.css'))
                //echo $file->getFilename().'<br>';
                echo "<link rel=\"stylesheet\" href=\"${relpath}\">";
            
            else if( // file is directory and does not start with .
                $file->isDir() && !$file->isDot() &&
                !str_starts_with($file->getFilename(), '.')
            )
                searchForCSS($relpath);
        }
    }

    
    searchForCSS('.');
?>