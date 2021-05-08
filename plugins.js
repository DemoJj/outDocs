const fs = require('fs')
const _path = require('path')
const _babelName = 'bable-plugin-demojx-md'
var _outDirName = 'readme'
var _allMdCache = ''
var _allMdCacheTimeout = null


function resolve(path) {
    return _path.join(__dirname, '.', path)
}

function saveFile(name, content) {
    if (!fs.existsSync(resolve(_outDirName))) {
        fs.mkdirSync(resolve(_outDirName))
    }
    fs.writeFile(resolve(`${_outDirName}/${name}.md`), content, function (error) {
        if (error) {
            console.error(error)
        } else {
            console.log('保存文件成功')
        }
    })
}

function buildReadMe(funName, chunks) {
    const TYPEMAP = {
        'string': '字符串',
        'number': '数值',
        'array': '数组',
        'object': '对象'
    }
    var data = {
        _funName: funName,
        _description: '无',
        _paramStr: '',
        _returns: '无',
        _otherMsg: ''
    }

    const KEYWORDMAPLIST = ['@description', '@param', '@returns']
    const KEYWORDMAP = new Map(Object.entries({
        '@description': function (chunk) {
            let tempDesc = /@description(.*)\r/.exec(chunk)[1]
            tempDesc.length && (data._description = tempDesc)
            console.log('描述', data._description)
        },
        '@param': function (chunk) {
            let paramChunks = chunk.match(/@param(.*)\r/)[1].match(/\S+/g)
            paramChunks[0] && (paramChunks[0] = TYPEMAP[paramChunks[0].match(/{(.*)}/)[1].toLowerCase()] || paramChunks[0].match(/{(.*)}/)[1].toLowerCase())
            if (paramChunks.length < 3) {
                data._paramStr += `|${paramChunks[1]}|${paramChunks[0]}|无|` + '\n'
            } else {
                data._paramStr += `|${paramChunks[1]}|${paramChunks[0]}|${paramChunks[2]}|` + '\n'
            }
            console.log('参数', data._paramStr)
        },
        '@returns': function (chunk) {
            let tempRes = /@returns(.*)\r/.exec(chunk)[1]
            tempRes.length && (data._returns = tempRes)
            console.log('返回', data._returns)
        }
    }))

    for (let i = 1; i < chunks.length; i++) {
        console.log(i, chunks[i])
        var curKeyWord = KEYWORDMAPLIST.find(k => chunks[i].includes(k))
        curKeyWord ? (KEYWORDMAP.get(curKeyWord) && KEYWORDMAP.get(curKeyWord)(chunks[i])) : (data._otherMsg+='\n'+(chunks[i].split('*')[1]||''))
    }

    var tempMd = fs.readFileSync('./readme.temp.md', 'utf-8')
    var pattern = /\$\{([\s\S]+?)\}/g;
    tempMd = tempMd.replace(pattern, function () {
        console.log('设置', data[arguments[1]])
        return data[arguments[1]]
    })
    return tempMd
}

const visitor = {
    name: _babelName,
    pre() {
        this.strCache = ''
        console.log('开始', this.strCache)
        _allMdCacheTimeout && clearTimeout(_allMdCacheTimeout)
    },
    visitor: {
        FunctionDeclaration(path) {
            var curNode = path.node
            if (curNode.leadingComments && curNode.leadingComments.length && curNode.leadingComments.some(o => o.type === 'CommentBlock')) {
                var tempName = curNode.id.name;
                var tempCommentChunks = curNode.leadingComments[0].value.split('\n')
                if (!tempCommentChunks[0].includes("@out")) return
                // saveFile(tempName, buildReadMe(tempName, tempCommentChunks))
                this.strCache += buildReadMe(tempName, tempCommentChunks) + '\n'
            }
        }
    },
    post(state) {
        let fileName = ''
        let opts = {}
        if(!state.opts.generatorOpts){ // 直接执行label
            fileName = state.opts.filename.split('.')[0]
        } else {
            fileName = state.opts.generatorOpts.sourceFileName.split('.')[0]
            opts = state.opts.plugins.find(p => p.key === _babelName).options
        }
        opts.outDirName && (_outDirName = opts.outDirName)
        if(opts.gather){
            _allMdCache+=this.strCache
            _allMdCacheTimeout = setTimeout(() => {
                saveFile(opts.gather, _allMdCache)
            }, 100);
        }else {
            this.strCache.length && saveFile(fileName, this.strCache)
        }

        console.log('[配置内容]:', opts)
        console.log('[结束文件]:', fileName);
    }
}

module.exports = function () {
    return visitor
}