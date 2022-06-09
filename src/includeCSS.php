<?php
    /** Searches for index.css files through out the served directory */
    function searchForCSS($directory){
        
        foreach (new DirectoryIterator($directory) as $file){

            $relpath = $directory.'/'.$file->getFilename();
            
            // file is css
            if( $file->getFilename() == 'index.css')
                echo "<link rel=\"stylesheet\" href=\"${relpath}\">";
            
            else if( // file is directory and does not start with .
                $file->isDir() && !$file->isDot() &&
                !str_starts_with($file->getFilename(), '.')
            )
                searchForCSS($relpath);
        }
    }

    echo "<!-- Recusive CSS -->";
    searchForCSS('.');
?>