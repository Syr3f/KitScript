fs = require 'fs'

{print} = require 'util'
{spawn} = require 'child_process'

_fpsrc = 'src/scripts/my'
_fpdest = 'KitScript.safariextension/scripts/my'

task 'build', 'Build '+_fpdest+' from '+_fpsrc, (callback) ->
  
  coffee = spawn 'coffee', ['-c', '-o', _fpdest, _fpsrc]
  
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  
  coffee.stdout.on 'data', (data) ->
    print data.toString() coffee.on 'exit', (code) ->

  callback?() if code is 0

task 'watch', 'Watch '+_fpsrc+' for changes', -> 
  coffee = spawn 'coffee', ['-w', '-c', '-o', _fpdest, _fpsrc]

  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()

  coffee.stdout.on 'data', (data) ->
    print data.toString()

