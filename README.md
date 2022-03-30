学力教育后台管理
```bash
# Clone project
git clone https://gitee.com/itgly/xueliedu-admin.git

# Install dependencies
npm install

# Serve with hot reload at localhost:9528
npm run dev

# Build for production with minification
npm run build

# Build for production and view the bundle analyzer report
npm run build --report
```


public class Solution {
    public boolean xiaochukuohao(String s) {
    Stack<Character> stack= new Stack<>();
        for(char c:s.toCharArray()){
            if(c=='(')stack.push(')');
            if(c=='[')stack.push(']');
            if(c=='{')stack.push('}');

            if(c==')'||c==']'||c=='}'){
                if(stack.isEmpty() || c!=stack.pop())return false;
            }
        }
        public static void main(String [] args){}
        
        return stack.isEmpty();
    }
}
