var fs = require('fs'),
    path = require('path');

function Release(version) {
    this.version = version;

    this.jsonFiles = ['package.json', 'bower.json'];

    this.releaseDir = 'release/';
    this.jsFile = path.join(this.releaseDir, 'bemer-' + version + '.js');
    this.jsMinFile = path.join(this.releaseDir, 'bemer-' + version + '.min.js');

    this.releaseBranch = 'release-' + version;
    this.releaseTag = 'v' + version;
}

Release.prototype = {

    getShellPreRelease: function() {
        return {
            command: [
                'git checkout dev',
                'cp ' + path.join(this.releaseDir, 'bemer.js') + ' ' + this.jsFile,
                'mv ' + path.join(this.releaseDir, 'bemer.min.js') + ' ' + this.jsMinFile,
                'git add ' + this.jsonFiles.join(' '),
                'git commit -m "' + this.releaseTag + '" -n',
                'git checkout -b ' + this.releaseBranch,
                'git add -f ' + this.jsFile + ' ' + this.jsMinFile,
                'git commit -m "' + this.releaseTag + '" -n',
                'git tag ' + this.releaseTag,
                'git checkout master && git branch -D ' + this.releaseBranch,
                'git merge --no-ff dev -m "' + this.releaseTag + '"'
            ].join(' && ')
        };
    },

    getShellRelease: function() {
        return [
            'git push origin master dev ' + this.releaseTag
        ].join(' && ');
    },

    /**
     * Обновить поле `version` в package.json и bower.json
     */
    changeJsonFilesVersion: function() {
        if(!this.version) throw new Error('Parameter --ver must be set!');

        this.jsonFiles.forEach(function(file) {
            var json = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
            json.version = this.version;
            fs.writeFileSync(file, JSON.stringify(json, undefined, '    ') + '\n');
        }, this);
    }

};

module.exports = Release;
