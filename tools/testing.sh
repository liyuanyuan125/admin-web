bname=$(git rev-parse --abbrev-ref HEAD)
if [ $bname = 'testing' ]; then
  echo 已在 testing 分支
else
  echo 在分支 $bname 上
  git pull && git push && git checkout testing &&
  git pull && git merge $bname && git push && git checkout $bname
fi
