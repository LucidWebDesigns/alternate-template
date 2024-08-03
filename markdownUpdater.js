const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { exec } = require('child_process');
const app = express();
const PORT = 3000;
const cors = require('cors');


app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Adjust if your HTML file is named differently
});

app.post('/test-route', (req, res) => {
    res.send('Hello World');
});

app.post('/update-md', (req, res) => {
    console.log('Received request to update title:', req.body.title);
    const { title } = req.body; // Get the title value from the request body
    const filePath = path.join(__dirname, 'src', 'blog', 'url.md'); // Path to the specific Markdown file

    console.log('Looking for file at:', filePath); // Log the file path to verify

    fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
            console.error('File does not exist or is not accessible:', err);
            return res.status(500).send('File does not exist or is not accessible');
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).send('Error reading file');
            }

            const match = data.match(/---\n([\s\S]+?)\n---\n([\s\S]*)/);
            if (!match) {
                console.error('No front matter found in file');
                return res.status(500).send('No front matter found');
            }

            const frontMatter = match[1];
            const content = match[2];

            let parsedFrontMatter = yaml.load(frontMatter);
            parsedFrontMatter.title = title || parsedFrontMatter.title; // Update title only if provided

            const updatedFrontMatter = yaml.dump(parsedFrontMatter);
            const updatedFileContent = `---\n${updatedFrontMatter}---\n${content}`;

            fs.writeFile(filePath, updatedFileContent, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).send('Error writing file');
                } else {
                    exec('npx @11ty/eleventy', (err, stdout, stderr) => {
                        if (err) {
                            console.error('Error rebuilding 11ty site:', err);
                            return res.status(500).send('Error rebuilding site');
                        } else {
                            console.log('11ty site successfully rebuilt!');
                            res.send('File successfully updated and site rebuilt!');
                        }
                    });
                }
            });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

