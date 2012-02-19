fs = require 'fs'

{print} = require 'util'
{spawn} = require 'child_process'

build = (callback) ->
  
  coffee = spawn 'coffee', ['-c', '-o', 'scripts/my', 'src/scripts/my']
  
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  
  coffee.stdout.on 'data', (data) ->
    print data.toString() coffee.on 'exit', (code) ->

  callback?() if code is 0

task 'build', 'Build scripts/my/ from src/scripts/my', -> build()